import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const larosePackages = /^@larose-ui\//;

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) => id === 'vue' || (larosePackages.test(id) && !id.endsWith('.css')),
    },
    cssCodeSplit: false,
  },
});
