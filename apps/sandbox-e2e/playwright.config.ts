import { defineConfig, devices } from '@playwright/test';
import { SANDBOX_PORTS } from '../sandbox-shared/scenarios.js';

const reuse = !process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'react',
      use: { baseURL: `http://127.0.0.1:${SANDBOX_PORTS.react}` },
    },
    {
      name: 'vue',
      use: { baseURL: `http://127.0.0.1:${SANDBOX_PORTS.vue}` },
    },
    {
      name: 'svelte',
      use: { baseURL: `http://127.0.0.1:${SANDBOX_PORTS.svelte}` },
    },
  ],
  webServer: [
    {
      command: `pnpm --filter @larose-ui/sandbox-react exec vite --host 127.0.0.1 --port ${SANDBOX_PORTS.react}`,
      url: `http://127.0.0.1:${SANDBOX_PORTS.react}`,
      reuseExistingServer: reuse,
      timeout: 120_000,
    },
    {
      command: `pnpm --filter @larose-ui/sandbox-vue exec vite --host 127.0.0.1 --port ${SANDBOX_PORTS.vue}`,
      url: `http://127.0.0.1:${SANDBOX_PORTS.vue}`,
      reuseExistingServer: reuse,
      timeout: 120_000,
    },
    {
      command: `pnpm --filter @larose-ui/sandbox-svelte exec vite --host 127.0.0.1 --port ${SANDBOX_PORTS.svelte}`,
      url: `http://127.0.0.1:${SANDBOX_PORTS.svelte}`,
      reuseExistingServer: reuse,
      timeout: 120_000,
    },
  ],
});
