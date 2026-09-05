import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';
import { agentReadyPlugin } from './vite/agent-ready-plugin';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** GitHub Pages project site: https://hamdymohamedak.github.io/larose-ui/ */
const DEFAULT_BASE_PATH = '/larose-ui/';

const base = process.env.VITE_BASE_PATH || DEFAULT_BASE_PATH;
const siteUrl =
  process.env.DOCS_SITE_URL ||
  (base === '/'
    ? 'http://localhost:5174'
    : `https://hamdymohamedak.github.io${base.replace(/\/$/, '')}`);

export default defineConfig({
  base,
  plugins: [
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkGfm], include: /\.mdx$/ }),
    },
    react({ include: /\.(jsx|js|mdx|tsx|ts)$/ }),
    agentReadyPlugin({ rootDir, basePath: base, siteUrl }),
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
  optimizeDeps: {
    include: [
      'vue',
      'svelte',
      'sucrase',
      '@vue/compiler-sfc',
      '@larose-ui/vue',
      '@larose-ui/svelte',
    ],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
});
