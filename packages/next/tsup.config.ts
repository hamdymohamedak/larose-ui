import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    server: 'src/server.ts',
    client: 'src/client.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'next/script', '@larose-ui/react', '@larose-ui/runtime-react'],
});
