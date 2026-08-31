import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ compilerOptions: { dev: true } })],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
