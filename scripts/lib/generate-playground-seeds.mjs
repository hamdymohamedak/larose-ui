import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PLAYGROUND_CONTROLS } from './docs-metadata.mjs';

/**
 * @typedef {'react' | 'vue' | 'svelte'} SeedFramework
 * @typedef {{ react: string, vue?: string, svelte?: string }} PlaygroundSeedEntry
 */

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
]);

/**
 * @param {string} type
 * @param {string} [fallbackDefault]
 */
export function exampleValueFromType(type, fallbackDefault) {
  if (fallbackDefault != null && fallbackDefault !== '') {
    return { kind: 'raw', value: fallbackDefault };
  }
  const t = (type || '').trim();
  if (!t) return { kind: 'string', value: 'example' };

  if (/^boolean$/i.test(t)) return { kind: 'boolean', value: true };
  if (/^number$/i.test(t)) return { kind: 'number', value: 0 };
  if (/^string$/i.test(t)) return { kind: 'string', value: 'example' };

  const unionMatch = t.match(/^'([^']+)'/);
  if (unionMatch) return { kind: 'string', value: unionMatch[1] };

  if (/\(\s*.*\)\s*=>/.test(t) || /^React\./.test(t) || /Node|Element|Snippet|VNode/.test(t)) {
    return { kind: 'omit' };
  }

  if (/\[\]$/.test(t) || /^Array</.test(t) || /Record</.test(t) || /\{/.test(t)) {
    return { kind: 'omit' };
  }

  if (/Placement|Size|Variant|Role|Orientation/.test(t)) {
    return { kind: 'string', value: 'md' };
  }

  return { kind: 'string', value: 'example' };
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
        return `${safeName}=${raw.includes('"') ? raw : raw.replace(/^'|'$/g, '"')}`;
      }
      return `:${safeName}="${raw.replace(/"/g, '')}"`;
    }
    if (/^'.*'$/.test(raw) || /^".*"$/.test(raw) || /^(true|false|\d)/.test(raw)) {
      if (/^'.*'$/.test(raw) || /^".*"$/.test(raw)) {
        const inner = raw.replace(/^['"]|['"]$/g, '');
        return `${safeName}="${inner}"`;
      }
      return `${safeName}={${raw}}`;
    }
    return `${safeName}={${raw}}`;
  }

  // string
  return `${safeName}="${example.value}"`;
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

  if (controls) {
    for (const [key, control] of Object.entries(controls)) {
      if (key === 'children') continue;
      const example =
        control.control === 'boolean'
          ? { kind: 'boolean', value: Boolean(control.default) }
          : control.control === 'number'
            ? { kind: 'number', value: control.default ?? 0 }
            : { kind: 'string', value: String(control.default ?? '') };
      if (example.kind === 'string' && example.value === '') continue;
      const formatted = formatProp(key, example, framework);
      if (formatted) lines.push(formatted);
    }
    return lines.slice(0, 6);
  }

  const contractProps = readContractProps(root, name);
  for (const prop of contractProps) {
    if (!prop?.name || SKIP_PROP_NAMES.has(prop.name.replace(/^['"]|['"]$/g, ''))) continue;
    if (prop.required !== true && lines.length >= 4) continue;
    const example = exampleValueFromType(prop.type, prop.default);
    if (prop.required !== true && example.kind === 'omit') continue;
    const formatted = formatProp(prop.name, example, framework);
    if (formatted) lines.push(formatted);
    if (lines.length >= 6) break;
  }
  return lines;
}

function childrenLabel(name, controls) {
  if (controls?.children?.default) return String(controls.children.default);
  if (/Button|Badge|Alert|Typography|Label/.test(name)) return 'Example';
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
