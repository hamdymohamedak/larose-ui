import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { laroseCssModules, laroseSandboxAliases } from '../sandbox-shared/laroseVite.mjs';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: laroseSandboxAliases(),
    dedupe: ['vue'],
  },
  css: {
    modules: laroseCssModules(),
  },
  server: {
    port: 5174,
    fs: { allow: ['../..'] },
  },
  optimizeDeps: {
    exclude: ['@larose-ui/vue', '@larose-ui/runtime-vue', '@larose-ui/styles'],
  },
});
