/**
 * Shared Vite resolve + CSS-modules config for laRose sandboxes.
 * Points at package *source* so library edits hot-reload like a real consumer app.
 *
 * Browser apps must import scenarios from `./scenarios.js` — not this file.
 */
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export { SCENARIOS } from './scenarios.js';

const here = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(here, '../..');

export function laroseSandboxAliases() {
  return [
    {
      find: '@larose-ui/react/styles.css',
      replacement: join(repoRoot, 'apps/playground/.storybook/larose-styles-stub.css'),
    },
    {
      find: '@larose-ui/styles/styles.css',
      replacement: join(repoRoot, 'packages/styles/dist/styles.css'),
    },
    {
      find: '@larose-ui/tokens/styles.css',
      replacement: join(repoRoot, 'packages/tokens/src/styles.css'),
    },
    {
      find: '@larose-ui/react',
      replacement: join(repoRoot, 'packages/react/src/index.ts'),
    },
    {
      find: '@larose-ui/vue',
      replacement: join(repoRoot, 'packages/vue/src/index.ts'),
    },
    {
      find: '@larose-ui/svelte',
      replacement: join(repoRoot, 'packages/svelte/src/lib/index.ts'),
    },
    {
      find: '@larose-ui/runtime-react/toast',
      replacement: join(repoRoot, 'packages/runtime-react/src/toast/index.ts'),
    },
    {
      find: '@larose-ui/runtime-react',
      replacement: join(repoRoot, 'packages/runtime-react/src/index.ts'),
    },
    {
      find: '@larose-ui/runtime-vue/toast',
      replacement: join(repoRoot, 'packages/runtime-vue/src/toast/index.ts'),
    },
    {
      find: '@larose-ui/runtime-vue',
      replacement: join(repoRoot, 'packages/runtime-vue/src/index.ts'),
    },
    {
      find: '@larose-ui/runtime-svelte/toast',
      replacement: join(repoRoot, 'packages/runtime-svelte/src/toast/index.ts'),
    },
    {
      find: '@larose-ui/runtime-svelte',
      replacement: join(repoRoot, 'packages/runtime-svelte/src/index.ts'),
    },
  ];
}

/** Match Storybook / build-css-package scoped class names: lr-CommandPalette-overlay */
export function laroseCssModules() {
  return {
    generateScopedName(name, filename) {
      const moduleName = basename(filename, '.module.css');
      return `lr-${moduleName}-${name}`;
    },
  };
}
