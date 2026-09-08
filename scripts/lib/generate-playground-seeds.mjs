import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PLAYGROUND_CONTROLS } from './docs-metadata.mjs';

/**
 * @typedef {'react' | 'vue' | 'svelte'} SeedFramework
 * @typedef {{ react: string, vue?: string, svelte?: string }} PlaygroundSeedEntry
 */

const PLACEHOLDER_IMAGE = 'https://placehold.co/160x100/png';

/** Props that are unsafe or useless in a minimal live demo. */
const SKIP_PROP_NAMES = new Set([
  'className',
  'style',
  'children',
  'as',
  'ref',
  'key',
  'dangerouslySetInnerHTML',
  'onDisplacementMapChange',
  'motion',
  'contentStyle',
  'contentClassName',
  'overlayClassName',
  'leftIcon',
  'rightIcon',
  'icon',
  'footer',
  'actions',
  'activities',
  'data',
  'series',
  'items',
  'options',
  'entries',
  'files',
  'columns',
  'collaborators',
  'participants',
  'menus',
  'tree',
  'segments',
  'tokens',
  'suggestions',
  // Controlled state — prefer default* props in demos
  'expanded',
  'open',
  'value',
  'checked',
  'selectedId',
  'selectedKey',
  'activeKey',
  'activeTab',
  // Noise / context-only
  'disabled',
  'transferring',
  'transferringLabel',
  'showInvalidIndicator',
  'annotation',
  'accessibilitySummary',
]);

/**
 * Fix truncated / malformed contract default strings.
 * @param {unknown} value
 */
function sanitizeDefault(value) {
  if (value == null) return undefined;
  let raw = String(value).trim();
  if (!raw) return undefined;

  // Unterminated quotes from truncated contracts (e.g. "'Drop an image")
  const quote = raw[0];
  if ((quote === "'" || quote === '"') && raw.length > 1 && !raw.endsWith(quote)) {
    raw = `${raw}${quote}`;
  }

  return raw;
}

/**
 * @param {string} name
 * @param {string} type
 * @param {string} [fallbackDefault]
 */
export function exampleValueFromType(type, fallbackDefault, name = '') {
  const cleanedDefault = sanitizeDefault(fallbackDefault);
  if (cleanedDefault != null && cleanedDefault !== '') {
    const looksLikeCode =
      /[=<>]|\?\?|\|\||&&|LIQUID_|PRESETS|default[A-Z]|function|=>|\{/.test(cleanedDefault) &&
      !/^['"].*['"]$/.test(cleanedDefault) &&
      !/^(true|false|null|undefined|-?\d+(\.\d+)?)$/.test(cleanedDefault);
    // Prefer name-based overrides when the contract default is clearly a placeholder / code fragment
    if (
      cleanedDefault === "'example'" ||
      cleanedDefault === '"example"' ||
      cleanedDefault === 'example' ||
      looksLikeCode
    ) {
      // fall through to heuristics
    } else {
      return { kind: 'raw', value: cleanedDefault };
    }
  }

  const prop = (name || '').replace(/^['"]|['"]$/g, '');
  const t = (type || '').trim();

  if (/^(src|url|href|imageUrl|thumbnailUrl|avatarUrl)$/i.test(prop)) {
    return { kind: 'string', value: PLACEHOLDER_IMAGE };
  }
  if (/alt/i.test(prop)) return { kind: 'string', value: 'Preview image' };
  if (/^(label|title|appTitle|appName|caption|emptyLabel|emptyMessage|manageLabel)$/i.test(prop)) {
    return { kind: 'string', value: prop === 'appName' || prop === 'appTitle' ? 'Employees' : 'Example' };
  }
  if (/placeholder/i.test(prop)) return { kind: 'string', value: 'Enter a value' };
  if (/maxHeight|minHeight|maxWidth|minWidth/i.test(prop)) return { kind: 'string', value: '12rem' };
  if (/importance/i.test(prop)) return { kind: 'string', value: 'primary' };
  if (/presentation/i.test(prop)) return { kind: 'string', value: 'sheet' };
  if (/typographyRole|buttonRole|role$/i.test(prop)) return { kind: 'string', value: 'body' };
  if (/variant/i.test(prop)) return { kind: 'string', value: 'primary' };
  if (/orientation/i.test(prop)) return { kind: 'string', value: 'horizontal' };
  if (/size|Size/.test(prop) && /^string$/i.test(t)) return { kind: 'string', value: 'md' };
  if (/zoneId|sourceId|id$/i.test(prop) && /^string$/i.test(t)) return { kind: 'string', value: 'demo' };
  if (/type$/i.test(prop) && /^string$/i.test(t)) return { kind: 'string', value: 'item' };

  if (!t) return { kind: 'omit' };

  if (/^boolean$/i.test(t)) return { kind: 'boolean', value: true };
  if (/^number$/i.test(t)) {
    if (/height/i.test(prop)) return { kind: 'number', value: 220 };
    if (/columns|maxVisible|page|total/i.test(prop)) return { kind: 'number', value: 3 };
    return { kind: 'number', value: 0 };
  }

  const unionMatch = t.match(/^'([^']+)'/);
  if (unionMatch) return { kind: 'string', value: unionMatch[1] };

  // Multi-union: 'primary' | 'secondary'
  const multiUnion = [...t.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (multiUnion.length >= 2 && !/\[\]|Array|Record|=>/.test(t)) {
    return { kind: 'string', value: multiUnion[0] };
  }

  if (/\(\s*.*\)\s*=>/.test(t) || /^React\./.test(t) || /Node|Element|Snippet|VNode|ReactNode/.test(t)) {
    return { kind: 'omit' };
  }

  if (/\[\]$/.test(t) || /^Array</.test(t) || /Record</.test(t) || /\{/.test(t)) {
    return { kind: 'omit' };
  }

  if (/LabelImportance/i.test(t)) return { kind: 'string', value: 'primary' };
  if (/TypographyRole/i.test(t)) return { kind: 'string', value: 'body' };
  if (/Placement|Size|Variant|Role|Orientation|Mark/.test(t)) {
    if (/Mark/.test(t)) return { kind: 'string', value: 'bar' };
    return { kind: 'string', value: 'md' };
  }

  if (/^string$/i.test(t)) {
    // Avoid littering demos with meaningless "example" strings
    return { kind: 'omit' };
  }

  return { kind: 'omit' };
}

/**
 * Format a prop assignment for a given framework.
 * @param {string} name
 * @param {{ kind: string, value?: unknown }} example
 * @param {SeedFramework} framework
 */
function formatProp(name, example, framework) {
  if (example.kind === 'omit') return null;
  const safeName = name.replace(/^['"]|['"]$/g, '');

  if (example.kind === 'boolean') {
    if (framework === 'vue') return example.value ? safeName : `:${safeName}="false"`;
    if (framework === 'svelte') return example.value ? safeName : `${safeName}={false}`;
    return example.value ? safeName : `${safeName}={false}`;
  }

  if (example.kind === 'number') {
    if (framework === 'vue') return `:${safeName}="${example.value}"`;
    return `${safeName}={${example.value}}`;
  }

  if (example.kind === 'raw') {
    const raw = String(example.value);
    // Already looks like a JS expression / quoted string
    if (framework === 'vue') {
      if (/^'.*'$/.test(raw) || /^".*"$/.test(raw)) {
        const inner = raw.slice(1, -1).replace(/"/g, '&quot;');
        return `${safeName}="${inner}"`;
      }
      return `:${safeName}="${raw.replace(/"/g, '')}"`;
    }
    if (/^'.*'$/.test(raw) || /^".*"$/.test(raw)) {
      const inner = raw.slice(1, -1);
      // Prefer double-quoted JSX attrs; escape embedded quotes
      if (!inner.includes('"')) return `${safeName}="${inner}"`;
      return `${safeName}={'${inner.replace(/'/g, "\\'")}'}`;
    }
    if (/^(true|false|\d)/.test(raw)) {
      return `${safeName}={${raw}}`;
    }
    return `${safeName}={${raw}}`;
  }

  // string — escape embedded quotes
  const value = String(example.value);
  if (!value.includes('"')) return `${safeName}="${value}"`;
  return `${safeName}={'${value.replace(/'/g, "\\'")}'}`;
}

/**
 * @param {string} root
 * @param {string} name
 */
function readContractProps(root, name) {
  const path = join(root, 'contracts/components', `${name}.json`);
  if (!existsSync(path)) return [];
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return Array.isArray(data.props) ? data.props : [];
  } catch {
    return [];
  }
}

/**
 * Build a small set of demo props for a component.
 * @param {string} root
 * @param {string} name
 * @param {SeedFramework} framework
 */
function demoPropsFor(root, name, framework) {
  /** @type {string[]} */
  const lines = [];
  const controls = PLAYGROUND_CONTROLS[name];
  const seen = new Set();

  if (controls) {
    for (const [key, control] of Object.entries(controls)) {
      if (key === 'children' || SKIP_PROP_NAMES.has(key)) continue;
      const example =
        control.control === 'boolean'
          ? { kind: 'boolean', value: Boolean(control.default) }
          : control.control === 'number'
            ? { kind: 'number', value: control.default ?? 0 }
            : { kind: 'string', value: String(control.default ?? '') };
      if (example.kind === 'string' && (example.value === '' || example.value === 'example')) continue;
      const formatted = formatProp(key, example, framework);
      if (formatted) {
        lines.push(formatted);
        seen.add(key);
      }
    }
    return lines.slice(0, 6);
  }

  const contractProps = readContractProps(root, name);
  const names = new Set(contractProps.map((p) => p?.name).filter(Boolean));

  for (const prop of contractProps) {
    const propName = prop?.name?.replace(/^['"]|['"]$/g, '');
    if (!propName || SKIP_PROP_NAMES.has(propName) || seen.has(propName)) continue;

    // Prefer defaultExpanded / defaultOpen / defaultValue over controlled twins (already skipped)
    if (propName.startsWith('default') && names.has(propName.replace(/^default/, '').replace(/^./, (c) => c.toLowerCase()))) {
      // keep default*
    }

    if (prop.required !== true && lines.length >= 4) continue;
    const example = exampleValueFromType(prop.type, prop.default, propName);
    if (example.kind === 'omit') continue;
    // Skip default false booleans — noise
    if (example.kind === 'boolean' && example.value === false && prop.required !== true) continue;

    const formatted = formatProp(propName, example, framework);
    if (formatted) {
      lines.push(formatted);
      seen.add(propName);
    }
    if (lines.length >= 6) break;
  }
  return lines;
}

function childrenLabel(name, controls) {
  if (controls?.children?.default) return String(controls.children.default);
  if (/Button|Badge|Alert|Typography|Label|Lockup|Ornament|DisclosureGroup|DisclosureButton|DropZone|Card/.test(name)) {
    return 'Example';
  }
  return null;
}

const VOID_LIKE = new Set([
  'Spinner',
  'Skeleton',
  'Progress',
  'LiquidGlassProgress',
  'LiquidGlassRange',
  'LiquidGlassSwitch',
  'Divider',
  'ImageWell',
  'ImageButton',
  'ImageView',
  'Chart',
  'TextView',
]);

/**
 * @param {string} root
 * @param {string} name
 * @param {SeedFramework} framework
 * @param {Set<string>} supported
 */
export function buildDefaultSeed(root, name, framework, supported) {
  if (!supported.has(framework)) return undefined;

  const pkg =
    framework === 'vue' ? '@larose-ui/vue' : framework === 'svelte' ? '@larose-ui/svelte' : '@larose-ui/react';
  const controls = PLAYGROUND_CONTROLS[name];
  const props = demoPropsFor(root, name, framework);
  const propBlock = props.length ? `\n  ${props.join('\n  ')}\n` : ' ';
  const child = childrenLabel(name, controls);
  const selfClosing = VOID_LIKE.has(name) || child == null;

  if (framework === 'react') {
    if (selfClosing) {
      return `import { ${name} } from '${pkg}';\n\nexport default function App() {\n  return <${name}${propBlock}/>;\n}\n`;
    }
    return `import { ${name} } from '${pkg}';\n\nexport default function App() {\n  return (\n    <${name}${propBlock}>\n      ${child}\n    </${name}>\n  );\n}\n`;
  }

  if (framework === 'vue') {
    if (selfClosing) {
      return `<script setup lang="ts">\nimport { ${name} } from '${pkg}';\n</script>\n\n<template>\n  <${name}${propBlock}/>\n</template>\n`;
    }
    return `<script setup lang="ts">\nimport { ${name} } from '${pkg}';\n</script>\n\n<template>\n  <${name}${propBlock}>\n    ${child}\n  </${name}>\n</template>\n`;
  }

  // svelte
  if (selfClosing) {
    return `<script lang="ts">\n  import { ${name} } from '${pkg}';\n</script>\n\n<${name}${propBlock}/>\n`;
  }
  return `<script lang="ts">\n  import { ${name} } from '${pkg}';\n</script>\n\n<${name}${propBlock}>\n  ${child}\n</${name}>\n`;
}

/** Hand-written seeds for components that need state / providers / optics. */
export function loadCuratedSeedOverrides(root) {
  const dir = join(root, 'scripts/lib/playground-seeds');
  /** @type {Record<string, PlaygroundSeedEntry>} */
  const overrides = {};
  if (!existsSync(dir)) return overrides;

  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const name = file.replace(/\.json$/, '');
    try {
      overrides[name] = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch {
      // ignore bad files
    }
  }
  return overrides;
}

/**
 * @param {string} root
 * @param {string[]} componentNames
 * @param {Record<string, SeedFramework[]>} frameworksByComponent
 */
export function buildPlaygroundSeeds(root, componentNames, frameworksByComponent) {
  const curated = loadCuratedSeedOverrides(root);
  /** @type {Record<string, PlaygroundSeedEntry>} */
  const seeds = {};

  for (const name of componentNames) {
    const supported = new Set(frameworksByComponent[name] ?? ['react']);
    if (curated[name]) {
      seeds[name] = curated[name];
      continue;
    }

    /** @type {PlaygroundSeedEntry} */
    const entry = {
      react: buildDefaultSeed(root, name, 'react', supported) ?? '',
    };
    const vue = buildDefaultSeed(root, name, 'vue', supported);
    const svelte = buildDefaultSeed(root, name, 'svelte', supported);
    if (vue) entry.vue = vue;
    if (svelte) entry.svelte = svelte;
    seeds[name] = entry;
  }

  return seeds;
}
