import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const larosePackages = /^@larose-ui\//;

export default defineConfig({
  plugins: [
    svelte(),
    dts({
      include: ['src/lib'],
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) =>
        id === 'svelte' ||
        id.startsWith('svelte/') ||
        (larosePackages.test(id) && !id.endsWith('.css')),
    },
    cssCodeSplit: false,
  },
});
