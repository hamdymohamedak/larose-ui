import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/toast/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@larose-ui/react'],
});
