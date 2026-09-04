import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const playgroundDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(playgroundDir, '../../..');
const stylesStub = join(playgroundDir, 'larose-styles-stub.css');

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: false,
    },
  },
  staticDirs: [],
  async viteFinal(config) {
    const vue = (await import('@vitejs/plugin-vue')).default;
    const { svelte } = await import('@sveltejs/vite-plugin-svelte');

    return mergeConfig(config, {
      plugins: [
        vue(),
        svelte({
          compilerOptions: { dev: true },
        }),
      ],
      css: {
        modules: {
          // Match the scoped class names produced by scripts/build-css-package.mjs
          generateScopedName(name, filename) {
            const moduleName = basename(filename, '.module.css');
            return `lr-${moduleName}-${name}`;
          },
        },
      },
      resolve: {
        dedupe: ['react', 'react-dom'],
        conditions: ['browser', 'svelte'],
        alias: [
          {
            find: '@larose-ui/react/styles.css',
            // Aggregate react CSS is unused in source-mode Storybook; modules load per component.
            // Keep a stub so preview can import the package path without a missing file.
            replacement: stylesStub,
          },
          {
            find: '@larose-ui/styles/styles.css',
            // Always load the pre-scoped design-system CSS so Vue/Svelte mounts
            // are never missing rules that React CSF already pulled via modules.
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
        ],
      },
      server: {
        fs: {
          allow: [repoRoot],
        },
      },
      optimizeDeps: {
        exclude: [
          '@larose-ui/runtime-react',
          '@larose-ui/vue',
          '@larose-ui/svelte',
          '@larose-ui/styles',
          '@larose-ui/themes',
          '@larose-ui/primitives',
          '@larose-ui/core',
          '@larose-ui/tokens',
          '@larose-ui/data-react',
          '@larose-ui/forms-react',
          '@larose-ui/network',
          '@larose-ui/offline',
          '@larose-ui/permissions-react',
          '@larose-ui/observability-react',
        ],
        include: ['vue', 'svelte', '@larose-ui/react'],
      },
    });
  },
};

export default config;
