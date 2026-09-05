import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseComponentExportsFromIndex } from './parse-index-exports.mjs';

/**
 * @param {string} root
 * @returns {{ react: Set<string>, vue: Set<string>, svelte: Set<string> }}
 */
export function detectFrameworkComponentExports(root) {
  const reactIndex = join(root, 'packages/react/src/index.ts');
  const vueIndex = join(root, 'packages/vue/src/index.ts');
  const svelteIndex = join(root, 'packages/svelte/src/lib/index.ts');
  const reactGlass = join(root, 'packages/react/src/LiquidGlass/index.ts');
  const vueGlass = join(root, 'packages/vue/src/LiquidGlass/index.ts');
  const svelteGlass = join(root, 'packages/svelte/src/lib/LiquidGlass/index.ts');

  const react = new Set(parseComponentExportsFromIndex(reactIndex));
  const vue = new Set(existsSync(vueIndex) ? parseComponentExportsFromIndex(vueIndex) : []);
  const svelte = new Set(existsSync(svelteIndex) ? parseComponentExportsFromIndex(svelteIndex) : []);

  for (const [set, path] of [
    [react, reactGlass],
    [vue, vueGlass],
    [svelte, svelteGlass],
  ]) {
    if (existsSync(path)) {
      for (const name of parseComponentExportsFromIndex(path)) set.add(name);
    }
  }

  return { react, vue, svelte };
}

/**
 * @param {string} name
 * @param {{ react: Set<string>, vue: Set<string>, svelte: Set<string> }} exports
 * @returns {Array<'react'|'vue'|'svelte'>}
 */
export function frameworksForComponent(name, exports) {
  /** @type {Array<'react'|'vue'|'svelte'>} */
  const list = [];
  if (exports.react.has(name)) list.push('react');
  if (exports.vue.has(name)) list.push('vue');
  if (exports.svelte.has(name)) list.push('svelte');
  return list.length ? list : ['react'];
}
