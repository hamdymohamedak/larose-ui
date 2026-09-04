import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import { toComponentContract } from './component-contract.mjs';
import { parseComponentExportsFromIndex } from './parse-index-exports.mjs';

const DOM_BASE_PROPS = new Set([
  'className',
  'style',
  'id',
  'role',
  'tabIndex',
  'children',
  'onClick',
  'onChange',
  'onSubmit',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyUp',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-hidden',
  'aria-expanded',
  'aria-controls',
  'aria-live',
  'aria-busy',
  'aria-disabled',
  'aria-pressed',
  'aria-checked',
  'aria-selected',
  'aria-current',
  'aria-modal',
  'aria-haspopup',
  'data-testid',
  'title',
  'lang',
  'dir',
  'hidden',
  'slot',
  'ref',
  'key',
]);

/**
 * @param {string} root
 * @param {string[]} componentNames
 * @param {string} [indexPath]
 */
export function extractComponentApi(root, componentNames, indexPath = join(root, 'packages/react/src/index.ts')) {
  const propsMap = parsePropsExports(indexPath);

  /** @type {Record<string, import('./docs-types.mjs').DocsComponentApi>} */
  const api = {};

  for (const name of componentNames) {
    const entry = propsMap.get(name);
    if (!entry) {
      api[name] = { props: [], events: [], accessibility: [] };
      continue;
    }

    const source = readSource(entry.filePath);
    if (!source) {
      api[name] = { props: [], events: [], accessibility: [] };
      continue;
    }

    const propsFilePath =
      resolvePropsTypeDefinition(entry.filePath, entry.propsTypeName) ?? entry.filePath;
    const propsSource = readSource(propsFilePath);
    if (!propsSource) {
      api[name] = { props: [], events: [], accessibility: [] };
      continue;
    }

    const defaults = extractDefaults(propsSource, name);
    const props = extractInterfaceProps(propsSource, entry.propsTypeName, defaults);
    api[name] = {
      props,
      events: props.filter((prop) => prop.name.startsWith('on')),
      accessibility: inferAccessibility(name, props),
    };
  }

  return api;
}

/**
 * Extract framework-neutral component contracts by sampling Props types from an adapter index.
 * The resulting JSON is canonical (`framework: "neutral"`); the adapter is only a Props sample source.
 * @param {string} root
 * @param {string[]} componentNames
 * @param {Record<string, { slots?: string[]; states?: string[] }>} [anatomy]
 * @param {'react' | 'vue' | 'svelte' | 'neutral'} [framework]
 * @param {string} [indexPath]
 */
export function extractComponentContracts(
  root,
  componentNames,
  anatomy = {},
  framework = 'react',
  indexPath,
) {
  const api = extractComponentApi(root, componentNames, indexPath);
  /** @type {Record<string, import('../../packages/contracts/src/types.ts').ComponentContract>} */
  const contracts = {};

  for (const name of componentNames) {
    contracts[name] = toComponentContract(
      name,
      api[name] ?? { props: [], events: [], accessibility: [] },
      anatomy,
      framework,
    );
  }

  return contracts;
}

/**
 * @param {string} indexPath
 * @param {string} reactRoot
 */
function parsePropsExports(indexPath) {
  /** @type {Map<string, { propsTypeName: string, filePath: string }>} */
  const map = new Map();
  const source = readFileSync(indexPath, 'utf8');
  const sourceFile = createSourceFile(indexPath, source);

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause) continue;
    if (!ts.isNamedExports(statement.exportClause)) continue;

    for (const element of statement.exportClause.elements) {
      const exportName = element.name.text;
      if (!exportName.endsWith('Props')) continue;

      const componentName = exportName.replace(/Props$/, '');
      const modulePath = statement.moduleSpecifier?.text;
      if (!modulePath) continue;

      const filePath = resolveModuleFile(join(dirname(indexPath), modulePath));
      if (!filePath) continue;

      map.set(componentName, { propsTypeName: exportName, filePath });
    }
  }

  // Components exported without matching Props export (fallback naming)
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause) continue;
    if (!ts.isNamedExports(statement.exportClause)) continue;
    if (statement.moduleSpecifier?.text?.includes('type')) continue;

    for (const element of statement.exportClause.elements) {
      const componentName = element.name.text;
      if (!/^[A-Z]/.test(componentName) || map.has(componentName)) continue;
      const guessed = `${componentName}Props`;
      const modulePath = statement.moduleSpecifier?.text;
      if (!modulePath) continue;
      const filePath = resolveModuleFile(join(dirname(indexPath), modulePath));
      if (!filePath) continue;
      const fileSource = readSource(filePath);
      if (fileSource && hasInterface(fileSource, guessed)) {
        map.set(componentName, { propsTypeName: guessed, filePath });
      }
    }
  }

  return map;
}

/**
 * Prefer the canonical contracts catalog; fall back to a Props-sample adapter index.
 * @param {string} root
 * @returns {string[]}
 */
export function listComponentNames(root) {
  const contractsDir = join(root, 'contracts/components');
  if (existsSync(contractsDir)) {
    const fromContracts = readdirSync(contractsDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/, ''));
    if (fromContracts.length > 0) {
      return [...new Set(fromContracts)].sort((a, b) => a.localeCompare(b));
    }
  }

  const indexPath = join(root, 'packages/react/src/index.ts');
  return [...new Set(parseComponentExportsFromIndex(indexPath))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/**
 * @param {string} basePath
 */
function resolveModuleFile(basePath) {
  const candidates = [
    `${basePath}.tsx`,
    `${basePath}.ts`,
    join(basePath, 'index.tsx'),
    join(basePath, 'index.ts'),
    join(basePath, 'types.ts'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Follow `export type { Props } from './module'` chains to the file that defines the interface.
 * @param {string} filePath
 * @param {string} typeName
 * @returns {string | null}
 */
function resolvePropsTypeDefinition(filePath, typeName) {
  const source = readSource(filePath);
  if (!source) return null;

  if (hasInterface(source, typeName)) {
    return filePath;
  }

  const sourceFile = createSourceFile(filePath, source);
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) continue;
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;

    const modulePath = statement.moduleSpecifier.text;
    const nextPath = resolveModuleFile(join(dirname(filePath), modulePath));
    if (!nextPath) continue;

    for (const element of statement.exportClause.elements) {
      const exportedName = element.name.text;
      const localName = element.propertyName?.text ?? exportedName;
      if (localName !== typeName && exportedName !== typeName) continue;

      const resolved = resolvePropsTypeDefinition(nextPath, typeName);
      if (resolved) return resolved;
    }
  }

  return null;
}

/**
 * @param {string | null} filePath
 */
function readSource(filePath) {
  if (!filePath || !existsSync(filePath)) return null;
  return readFileSync(filePath, 'utf8');
}

/**
 * @param {string} filePath
 * @param {string} source
 */
function createSourceFile(filePath, source) {
  const kind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
}

/**
 * @param {string} source
 * @param {string} typeName
 */
function hasInterface(source, typeName) {
  const filePath = 'virtual.ts';
  const sourceFile = createSourceFile(filePath, source);
  let found = false;
  visit(sourceFile, (node) => {
    if (
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      node.name.text === typeName
    ) {
      found = true;
    }
  });
  return found;
}

/**
 * @param {string} source
 * @param {string} typeName
 * @param {Map<string, string>} defaults
 */
function extractInterfaceProps(source, typeName, defaults) {
  const filePath = 'virtual.ts';
  const sourceFile = createSourceFile(filePath, source);
  /** @type {import('./docs-types.mjs').DocsPropEntry[]} */
  const props = [];

  visit(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === typeName) {
      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || !member.name) continue;
        const name = member.name.getText(sourceFile);
        const required = !member.questionToken;
        const typeText = member.type ? member.type.getText(sourceFile) : 'unknown';
        const description = extractJsDoc(member);
        props.push({
          name,
          type: normalizeTypeText(typeText),
          required,
          default: defaults.get(name),
          description,
          inherited: DOM_BASE_PROPS.has(name),
        });
      }
    }
  });

  return props.sort((a, b) => {
    if (a.inherited !== b.inherited) return a.inherited ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * @param {string} source
 * @param {string} componentName
 */
function extractDefaults(source, componentName) {
  const filePath = 'virtual.tsx';
  const sourceFile = createSourceFile(filePath, source);
  /** @type {Map<string, string>} */
  const defaults = new Map();

  visit(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!decl.initializer) continue;
      const bindingName = decl.name.getText(sourceFile);
      if (bindingName !== componentName) continue;

      const init = decl.initializer;
      if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
        const param = init.parameters[0];
        if (param && ts.isObjectBindingPattern(param.name)) {
          for (const element of param.name.elements) {
            const propName = element.name.getText(sourceFile);
            if (element.initializer) {
              defaults.set(propName, element.initializer.getText(sourceFile));
            }
          }
        }
      }
    }

    if (ts.isFunctionDeclaration(node) && node.name?.text === componentName) {
      const param = node.parameters[0];
      if (param && ts.isObjectBindingPattern(param.name)) {
        for (const element of param.name.elements) {
          const propName = element.name.getText(sourceFile);
          if (element.initializer) {
            defaults.set(propName, element.initializer.getText(sourceFile));
          }
        }
      }
    }
  });

  // forwardRef pattern: const X = forwardRef((props, ref) => { const { a = 1 } = useComponentDefaults(...)
  const destructuringMatch = source.match(
    new RegExp(
      `(?:useComponentDefaults\\('${componentName}',[^)]*\\)|\\(\\s*\\{)([\\s\\S]*?)\\}\\s*[,=)]`,
    ),
  );
  if (destructuringMatch) {
    const block = destructuringMatch[1];
    for (const match of block.matchAll(/(\w+)\s*=\s*([^,\n}]+)/g)) {
      defaults.set(match[1], match[2].trim());
    }
  }

  return defaults;
}

/**
 * @param {ts.Node} node
 */
function extractJsDoc(node) {
  const tags = ts.getJSDocCommentsAndTags(node);
  if (!tags.length) return undefined;
  const comment = tags.find((tag) => ts.isJSDoc(tag));
  if (!comment || !comment.comment) return undefined;
  if (typeof comment.comment === 'string') return comment.comment.trim();
  return comment.comment.map((part) => part.text).join('').trim() || undefined;
}

/**
 * @param {string} typeText
 */
function normalizeTypeText(typeText) {
  return typeText.replace(/\s+/g, ' ').trim();
}

/**
 * @param {ts.Node} node
 * @param {(node: ts.Node) => void} callback
 */
function visit(node, callback) {
  callback(node);
  ts.forEachChild(node, (child) => visit(child, callback));
}

/**
 * @param {string} componentName
 * @param {import('./docs-types.mjs').DocsPropEntry[]} props
 */
function inferAccessibility(componentName, props) {
  /** @type {string[]} */
  const notes = [];
  const propNames = new Set(props.map((prop) => prop.name));

  if (propNames.has('aria-label') || props.some((prop) => prop.name.includes('aria'))) {
    notes.push('Supports ARIA attributes via standard HTML element props.');
  }
  if (props.some((prop) => prop.name.startsWith('onKey'))) {
    notes.push('Keyboard event handlers are available for custom keyboard behavior.');
  }
  if (['Modal', 'Dialog', 'Drawer', 'AlertDialog', 'Popover', 'CommandPalette'].includes(componentName)) {
    notes.push('Focus is managed while open; Escape typically closes the overlay.');
  }
  if (['Button', 'Checkbox', 'Radio', 'Switch', 'Select', 'Input'].includes(componentName)) {
    notes.push('Uses native or laRose-managed focus rings and disabled states.');
  }
  if (componentName === 'Button' && propNames.has('loadingLabel')) {
    notes.push('Provide loadingLabel for accessible loading announcements.');
  }

  return notes;
}
