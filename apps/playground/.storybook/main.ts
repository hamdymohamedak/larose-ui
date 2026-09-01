import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const playgroundDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(playgroundDir, '../../..');

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
      resolve: {
        dedupe: ['react', 'react-dom'],
        conditions: ['browser', 'svelte'],
        alias: [
          {
            find: '@larose-ui/react/styles.css',
            replacement: join(repoRoot, 'packages/react/dist/index.css'),
          },
          {
            find: '@larose-ui/react',
            replacement: join(repoRoot, 'packages/react/dist/index.js'),
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
      optimizeDeps: {
        exclude: [
          '@larose-ui/runtime',
          '@larose-ui/vue',
          '@larose-ui/svelte',
          '@larose-ui/styles',
          '@larose-ui/themes',
          '@larose-ui/primitives',
          '@larose-ui/core',
          '@larose-ui/tokens',
          '@larose-ui/data',
          '@larose-ui/forms',
          '@larose-ui/network',
          '@larose-ui/offline',
          '@larose-ui/permissions',
          '@larose-ui/observability',
        ],
        include: ['vue', 'svelte', '@larose-ui/react'],
      },
    });
  },
};

export default config;
