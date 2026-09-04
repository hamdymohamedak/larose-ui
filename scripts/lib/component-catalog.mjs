import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseComponentExportsFromIndex } from './parse-index-exports.mjs';
import { isGlassDocComponent } from './glass-components.mjs';

/**
 * Components that are intentionally framework-specific (not required on every adapter).
 * Fiber DevTools, React-only motion host, and Liquid Glass React entry re-exports live here.
 */
export const INTENTIONAL_ADAPTER_ASYMMETRIES = new Set([
  'Collapse',
  'LiquidGlass',
  'LiquidGlassButton',
  'LiquidGlassCheckbox',
  'LiquidGlassProgress',
  'LiquidGlassRange',
  'LiquidGlassSwitch',
  'LiquidGlassTabBar',
  'LiquidGlassTopBar',
  'MotionProvider',
  'Presence',
  'ThemeCustomizationContext',
  // Vue/Svelte host the lightweight runtime store in the UI package; React keeps it in runtime-react.
  'RuntimeProvider',
  'FieldShell',
]);

/**
 * @param {string} root
 * @returns {string[]}
 */
export function listCanonicalContractNames(root) {
  const dir = join(root, 'contracts/components');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * @param {string} root
 */
export function listFrameworkComponentExports(root) {
  const reactIndex = join(root, 'packages/react/src/index.ts');
  const vueIndex = join(root, 'packages/vue/src/index.ts');
  const svelteIndex = join(root, 'packages/svelte/src/lib/index.ts');
  const liquidGlassIndex = join(root, 'packages/react/src/LiquidGlass/index.ts');

  const react = existsSync(reactIndex) ? parseComponentExportsFromIndex(reactIndex) : [];
  const vue = existsSync(vueIndex) ? parseComponentExportsFromIndex(vueIndex) : [];
  const svelte = existsSync(svelteIndex) ? parseComponentExportsFromIndex(svelteIndex) : [];
  const glass = existsSync(liquidGlassIndex)
    ? parseComponentExportsFromIndex(liquidGlassIndex).filter(isGlassDocComponent)
    : [];

  return {
    react: [...new Set([...react, ...glass])].sort((a, b) => a.localeCompare(b)),
    vue: [...vue].sort((a, b) => a.localeCompare(b)),
    svelte: [...svelte].sort((a, b) => a.localeCompare(b)),
  };
}

/**
 * Shared UI surface = exported by all three adapters, minus intentional asymmetries.
 * @param {string} root
 * @returns {string[]}
 */
export function listSharedComponentNames(root) {
  const { react, vue, svelte } = listFrameworkComponentExports(root);
  const vueSet = new Set(vue);
  const svelteSet = new Set(svelte);
  return react.filter(
    (name) =>
      !INTENTIONAL_ADAPTER_ASYMMETRIES.has(name) && vueSet.has(name) && svelteSet.has(name),
  );
}

/**
 * Canonical catalog for contracts: existing JSON ∪ shared three-way surface.
 * Contracts remain the source of truth; adapters must conform.
 * @param {string} root
 * @returns {string[]}
 */
export function listContractCatalog(root) {
  const names = new Set([
    ...listCanonicalContractNames(root),
    ...listSharedComponentNames(root),
  ]);
  return [...names].sort((a, b) => a.localeCompare(b));
}

/**
 * @param {string} root
 * @param {'react' | 'vue' | 'svelte'} framework
 */
export function resolveAdapterIndexPath(root, framework) {
  if (framework === 'react') return join(root, 'packages/react/src/index.ts');
  if (framework === 'vue') return join(root, 'packages/vue/src/index.ts');
  return join(root, 'packages/svelte/src/lib/index.ts');
}

/**
 * Props-type extraction works best against TypeScript `*Props` exports.
 * React currently ships the richest Props surface; Vue/Svelte often inline props.
 * This is a sampling reference for authoring — not the architectural source of truth.
 * @param {string} root
 * @param {'react' | 'vue' | 'svelte' | 'auto'} [preferred]
 * @returns {'react' | 'vue' | 'svelte'}
 */
export function resolvePropsSampleAdapter(root, preferred = 'auto') {
  if (preferred !== 'auto') return preferred;
  for (const framework of /** @type {const} */ (['react', 'vue', 'svelte'])) {
    const indexPath = resolveAdapterIndexPath(root, framework);
    if (!existsSync(indexPath)) continue;
    const source = readFileSync(indexPath, 'utf8');
    if (/export type \{[^}]*Props/.test(source) || /Props['"]?\s*\}/.test(source)) {
      return framework;
    }
  }
  return 'react';
}
