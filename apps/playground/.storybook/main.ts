import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const storybookDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(storybookDir, '../../..');

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [],
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@larose-ui/react': join(repoRoot, 'packages/react/src/index.ts'),
          '@larose-ui/runtime': join(repoRoot, 'packages/runtime/src/index.ts'),
          '@larose-ui/core': join(repoRoot, 'packages/core/src/index.ts'),
        },
        dedupe: ['react', 'react-dom'],
      },
    });
  },
};

export default config;
