import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { laroseCssModules, laroseSandboxAliases } from '../sandbox-shared/laroseVite.mjs';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: laroseSandboxAliases(),
    dedupe: ['react', 'react-dom'],
  },
  css: {
    modules: laroseCssModules(),
  },
  server: {
    port: 5173,
    fs: { allow: ['../..'] },
  },
});
