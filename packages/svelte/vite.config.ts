import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import { laroseCssModules, syncFrameworkStylesCss } from '../../scripts/styles-package.mjs';

const packageRoot = dirname(fileURLToPath(import.meta.url));
const larosePackages = /^@larose-ui\//;

export default defineConfig({
  plugins: [
    svelte(),
    dts({
      include: ['src/lib'],
      rollupTypes: false,
    }),
    {
      name: 'larose-sync-styles-css',
      closeBundle() {
        syncFrameworkStylesCss(packageRoot);
      },
    },
  ],
  css: {
    modules: laroseCssModules(),
  },
  build: {
    lib: {
      entry: resolve(packageRoot, 'src/lib/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) =>
        id === 'svelte' || id.startsWith('svelte/') || (larosePackages.test(id) && !id.endsWith('.css')),
    },
    cssCodeSplit: false,
  },
});
