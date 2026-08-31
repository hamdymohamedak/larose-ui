import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/client.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    '@larose-ui/runtime',
    '@larose-ui/desktop-core',
    'react',
    'react-dom',
    '@tauri-apps/api',
  ],
});
