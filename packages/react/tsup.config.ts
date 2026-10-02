import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.module.css': 'local-css',
    };
  },
});
