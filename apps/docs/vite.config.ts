import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkGfm], include: /\.mdx$/ }),
    },
    react({ include: /\.(jsx|js|mdx|tsx|ts)$/ }),
  ],
  resolve: {
    alias: {
      '@': path.join(rootDir, 'src'),
    },
  },
  assetsInclude: ['**/*.md'],
  server: {
    port: 5174,
    fs: {
      allow: [path.join(rootDir, '../..')],
    },
  },
});
