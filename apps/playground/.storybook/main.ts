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
        alias: {
          '@larose-ui/vue': join(repoRoot, 'packages/vue/src/index.ts'),
          '@larose-ui/svelte': join(repoRoot, 'packages/svelte/src/lib/index.ts'),
        },
      },
      optimizeDeps: {
        exclude: [
          '@larose-ui/react',
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
        include: ['vue', 'svelte'],
      },
    });
  },
};

export default config;
