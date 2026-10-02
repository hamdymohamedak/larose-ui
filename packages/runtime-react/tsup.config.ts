import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/toast/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    '@larose-ui/react',
    '@larose-ui/runtime-core',
  ],
});
