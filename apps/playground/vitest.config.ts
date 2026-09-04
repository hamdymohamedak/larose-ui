import { defineConfig } from 'vitest/config';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const playgroundDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(playgroundDir, '../..');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['.storybook/**/*.test.ts'],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
