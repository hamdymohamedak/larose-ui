import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import { laroseCssModules, syncFrameworkStylesCss } from '../../scripts/styles-package.mjs';

const packageRoot = dirname(fileURLToPath(import.meta.url));
const larosePackages = /^@larose-ui\//;

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src', 'env.d.ts'],
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
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
      entry: resolve(packageRoot, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) => id === 'vue' || (larosePackages.test(id) && !id.endsWith('.css')),
    },
    cssCodeSplit: false,
  },
});
