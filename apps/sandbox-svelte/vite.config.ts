import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { laroseCssModules, laroseSandboxAliases } from '../sandbox-shared/laroseVite.mjs';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: laroseSandboxAliases(),
    conditions: ['browser', 'svelte'],
    dedupe: ['svelte'],
  },
  css: {
    modules: laroseCssModules(),
  },
  server: {
    port: 5175,
    fs: { allow: ['../..'] },
  },
  optimizeDeps: {
    exclude: ['@larose-ui/svelte', '@larose-ui/runtime-svelte', '@larose-ui/styles'],
  },
});
