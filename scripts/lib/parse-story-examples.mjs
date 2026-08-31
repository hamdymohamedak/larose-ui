import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} root
 * @param {string[]} componentNames
 */
export function buildStoryExamplesIndex(root, componentNames) {
  const storiesDir = join(root, 'apps/playground/stories');
  if (!existsSync(storiesDir)) return {};

  const nameSet = new Set(componentNames);
  /** @type {Record<string, import('./docs-types.mjs').DocsExampleEntry[]>} */
  const index = Object.fromEntries(componentNames.map((name) => [name, []]));

  const files = readdirSync(storiesDir).filter((file) => file.endsWith('.stories.tsx'));

  for (const file of files) {
    const source = readFileSync(join(storiesDir, file), 'utf8');
    const metaComponent = extractMetaComponent(source);
    const titleComponent = extractTitleComponent(source);
    const primary = metaComponent && nameSet.has(metaComponent) ? metaComponent : null;

    const stories = parseStoriesFromSource(source, primary ?? titleComponent ?? 'Component');

    if (primary) {
      index[primary].push(...stories);
      continue;
    }

    for (const story of stories) {
      const inferred = inferComponentForStory(story, bodyForStory(story, source), nameSet);
      if (inferred) {
        index[inferred].push(story);
      }
    }
  }

  for (const name of componentNames) {
    index[name] = dedupeExamples(index[name]).slice(0, 16);
  }

  return index;
}

/**
 * @param {string} root
 * @param {string} componentName
 */
export function parseStoryExamples(root, componentName) {
  const storiesDir = join(root, 'apps/playground/stories');
  const index = buildStoryExamplesIndex(root, [componentName]);
  return index[componentName] ?? [];
}

/**
 * @param {string} source
 */
function extractMetaComponent(source) {
  const match = source.match(/component:\s*(\w+)/);
  return match?.[1] ?? null;
}

/**
 * @param {string} source
 */
function extractTitleComponent(source) {
  const match = source.match(/title:\s*['"`][^/'"`]+\/([^'"`]+)['"`]/);
  if (!match?.[1]) return null;
  return normalizeComponentName(match[1]);
}

/**
 * @param {string} label
 */
function normalizeComponentName(label) {
  const cleaned = label.trim().replace(/\s+/g, '');
  if (/^[A-Z]/.test(cleaned)) return cleaned;
  return cleaned
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * @param {string} source
 * @param {string} defaultComponent
 */
function parseStoriesFromSource(source, defaultComponent) {
  /** @type {import('./docs-types.mjs').DocsExampleEntry[]} */
  const examples = [];
  const storyRegex = /export const (\w+):\s*Story(?:Obj)?\s*=\s*\{([\s\S]*?)\n\};/g;

  for (const match of source.matchAll(storyRegex)) {
    const exportName = match[1];
    const body = match[2];
    const nameMatch = body.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const title = nameMatch?.[1] ?? exportName.replace(/([A-Z])/g, ' $1').trim();

    const argsMatch = body.match(/args:\s*\{([\s\S]*?)\}/);
    if (argsMatch) {
      const props = parseArgsObject(argsMatch[1]);
      examples.push({
        id: exportName,
        title,
        kind: classifyExample(exportName, title),
        props,
        code: generateExampleCode(defaultComponent, props),
      });
      continue;
    }

    if (body.includes('render:')) {
      examples.push({
        id: exportName,
        title,
        kind: classifyExample(exportName, title),
        props: {},
        code: extractRenderSnippet(body) ?? `// See Storybook story "${exportName}" for full example.`,
        composite: true,
      });
    }
  }

  return examples;
}

/**
 * @param {import('./docs-types.mjs').DocsExampleEntry} story
 * @param {string} storySource
 * @param {Set<string>} nameSet
 */
function inferComponentForStory(story, _storySource, nameSet) {
  return inferFromExportName(story.id, nameSet);
}

/**
 * @param {import('./docs-types.mjs').DocsExampleEntry} story
 * @param {string} source
 */
function bodyForStory(story, source) {
  const block = source.match(
    new RegExp(`export const ${story.id}:\\s*Story(?:Obj)?\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`),
  );
  return block?.[1] ?? source;
}

/**
 * @param {string} exportName
 * @param {Set<string>} nameSet
 */
function inferFromExportName(exportName, nameSet) {
  const sorted = [...nameSet].sort((a, b) => b.length - a.length);
  for (const name of sorted) {
    if (exportName === name) return name;
    if (exportName.startsWith(name)) return name;
    if (exportName.endsWith(name)) return name;
    if (new RegExp(`^${name}(Default|Story|Example|Group)?$`).test(exportName)) return name;
  }
  return null;
}

/**
 * @param {string} body
 * @param {string} fallback
 */
function inferComponentFromRender(body, fallback) {
  const match = body.match(/<([A-Z][A-Za-z0-9]*)\b/);
  return match?.[1] ?? fallback;
}

/**
 * @param {string} body
 */
function extractRenderSnippet(body) {
  const arrow = body.match(/render:\s*\([^)]*\)\s*=>\s*(<[\s\S]*?>)/);
  if (arrow?.[1] && arrow[1].length < 280) return arrow[1];

  const fn = body.match(/render:\s*function[\s\S]*?return\s*\(?\s*(<[\s\S]*?>)\s*\)?;/);
  if (fn?.[1] && fn[1].length < 280) return fn[1];

  return null;
}

/**
 * @param {string} argsSource
 */
function parseArgsObject(argsSource) {
  /** @type {Record<string, string | number | boolean>} */
  const props = {};
  const pattern =
    /(\w+):\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`|(true|false)|(-?\d+(?:\.\d+)?))/g;

  for (const match of argsSource.matchAll(pattern)) {
    const key = match[1];
    const value =
      match[2] ?? match[3] ?? match[4] ?? (match[5] ? match[5] === 'true' : undefined) ?? Number(match[6]);
    if (key && value !== undefined) props[key] = value;
  }

  return props;
}

/**
 * @param {string} exportName
 * @param {string} title
 */
function classifyExample(exportName, title) {
  const lower = `${exportName} ${title}`.toLowerCase();
  if (lower.includes('primary') || lower.includes('basic') || lower.includes('default')) return 'basic';
  if (lower.includes('variant') || lower.includes('all')) return 'variants';
  if (lower.includes('size')) return 'sizes';
  if (lower.includes('load')) return 'loading';
  if (lower.includes('disabled')) return 'disabled';
  if (lower.includes('icon')) return 'with-icon';
  if (lower.includes('destruct')) return 'destructive';
  if (lower.includes('error')) return 'error';
  return 'advanced';
}

/**
 * @param {string} componentName
 * @param {Record<string, string | number | boolean>} props
 */
function generateExampleCode(componentName, props) {
  const voidElements = new Set(['Spinner', 'Skeleton', 'Progress']);
  const propEntries = Object.entries(props).filter(([key]) => key !== 'children');
  const propLines = propEntries.map(([key, value]) => {
    if (typeof value === 'string') return `  ${key}="${value}"`;
    if (typeof value === 'boolean') return value ? `  ${key}` : `  ${key}={false}`;
    return `  ${key}={${JSON.stringify(value)}}`;
  });

  const child = typeof props.children === 'string' ? props.children : 'Example';
  if (voidElements.has(componentName)) {
    return `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ' '}/>`;
  }

  const open = `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ''}>`;
  return `${open}${child}</${componentName}>`;
}

/**
 * @param {import('./docs-types.mjs').DocsExampleEntry[]} examples
 */
function dedupeExamples(examples) {
  const seen = new Set();
  return examples.filter((example) => {
    const key = `${example.id}:${example.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
