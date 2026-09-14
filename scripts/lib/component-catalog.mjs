import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseComponentExportsFromIndex } from './parse-index-exports.mjs';
import { isGlassDocComponent } from './glass-components.mjs';

/**
 * Components that are intentionally framework-specific (not required on every adapter).
 * Prefer documenting these in contracts/parity/matrix.json notes — do not grow this set casually.
 * Liquid Glass and shared overlays must ship on all three adapters.
 */
export const INTENTIONAL_ADAPTER_ASYMMETRIES = new Set([
  'Collapse',
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
 * @param {'react' | 'vue' | 'svelte'} framework
 */
export function resolveLiquidGlassIndexPath(root, framework) {
  if (framework === 'react') return join(root, 'packages/react/src/LiquidGlass/index.ts');
  if (framework === 'vue') return join(root, 'packages/vue/src/LiquidGlass/index.ts');
  return join(root, 'packages/svelte/src/lib/LiquidGlass/index.ts');
}

/**
 * @param {string} root
 */
export function listFrameworkComponentExports(root) {
  const reactIndex = join(root, 'packages/react/src/index.ts');
  const vueIndex = join(root, 'packages/vue/src/index.ts');
  const svelteIndex = join(root, 'packages/svelte/src/lib/index.ts');

  const react = existsSync(reactIndex) ? parseComponentExportsFromIndex(reactIndex) : [];
  const vue = existsSync(vueIndex) ? parseComponentExportsFromIndex(vueIndex) : [];
  const svelte = existsSync(svelteIndex) ? parseComponentExportsFromIndex(svelteIndex) : [];

  const mergeGlass = (/** @type {string[]} */ base, /** @type {'react'|'vue'|'svelte'} */ fw) => {
    const glassIndex = resolveLiquidGlassIndexPath(root, fw);
    if (!existsSync(glassIndex)) return base;
    const glass = parseComponentExportsFromIndex(glassIndex).filter(isGlassDocComponent);
    return [...new Set([...base, ...glass])];
  };

  return {
    react: mergeGlass(react, 'react').sort((a, b) => a.localeCompare(b)),
    vue: mergeGlass(vue, 'vue').sort((a, b) => a.localeCompare(b)),
    svelte: mergeGlass(svelte, 'svelte').sort((a, b) => a.localeCompare(b)),
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
 * Choose an adapter only as a Props *sampling* source for authoring contracts.
 * Contracts are always emitted as framework-neutral JSON — never treat the sample
 * adapter as the architectural source of truth.
 *
 * Preference order for `auto`: first adapter with exported `*Props` types (any framework).
 * @param {string} root
 * @param {'react' | 'vue' | 'svelte' | 'auto'} [preferred]
 * @returns {'react' | 'vue' | 'svelte'}
 */
export function resolvePropsSampleAdapter(root, preferred = 'auto') {
  if (preferred !== 'auto') return preferred;
  // Prefer whichever adapter currently exposes the richest typed Props surface.
  // Order is alphabetical by framework name so React is not privileged by position.
  for (const framework of /** @type {const} */ (['svelte', 'vue', 'react'])) {
    const indexPath = resolveAdapterIndexPath(root, framework);
    if (!existsSync(indexPath)) continue;
    const source = readFileSync(indexPath, 'utf8');
    if (/export type \{[^}]*Props/.test(source) || /Props['"]?\s*\}/.test(source)) {
      return framework;
    }
  }
  for (const framework of /** @type {const} */ (['svelte', 'vue', 'react'])) {
    if (existsSync(resolveAdapterIndexPath(root, framework))) return framework;
  }
  return 'react';
}
