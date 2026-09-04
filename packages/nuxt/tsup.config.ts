import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/module.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['@larose-ui/vue', '@larose-ui/runtime-vue', '@nuxt/kit', 'nuxt'],
});
