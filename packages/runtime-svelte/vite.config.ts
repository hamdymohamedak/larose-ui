import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte(), dts({ include: ['src'], rollupTypes: false })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'toast/index': resolve(__dirname, 'src/toast/index.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: (id) =>
        id === 'svelte' || id.startsWith('svelte/') || (/^@larose-ui\//.test(id) && !id.endsWith('.css')),
    },
    cssCodeSplit: false,
  },
});
