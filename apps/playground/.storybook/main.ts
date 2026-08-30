import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

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
    return mergeConfig(config, {
      resolve: {
        dedupe: ['react', 'react-dom'],
      },
      optimizeDeps: {
        // Workspace packages are rebuilt often — exclude from prebundle to avoid stale SB cache.
        exclude: ['@larose-ui/react', '@larose-ui/runtime', '@larose-ui/data'],
        include: [
          '@larose-ui/core',
          '@larose-ui/tokens',
          '@larose-ui/themes',
          '@larose-ui/network',
          '@larose-ui/offline',
          '@larose-ui/permissions',
          '@larose-ui/observability',
          '@larose-ui/forms',
        ],
      },
    });
  },
};

export default config;
