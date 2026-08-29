#!/usr/bin/env node
/**
 * Bundle budget check — used by CI and local scripts.
 * Exits 1 when any @larose/* package exceeds its raw dist budget.
 */
import { stat } from 'node:fs/promises';
import { join } from 'node:path';

const packagesDir = join(process.cwd(), 'packages');

/** @type {Record<string, { file: string; budget: number }>} */
const BUDGETS = {
  core: { file: 'dist/index.js', budget: 10 },
  tokens: { file: 'dist/index.js', budget: 5 },
  network: { file: 'dist/index.js', budget: 6 },
  offline: { file: 'dist/index.js', budget: 5 },
  permissions: { file: 'dist/index.js', budget: 8 },
  data: { file: 'dist/index.js', budget: 15 },
  forms: { file: 'dist/index.js', budget: 10 },
  react: { file: 'dist/index.js', budget: 70 },
  runtime: { file: 'dist/index.js', budget: 36 },
  observability: { file: 'dist/index.js', budget: 26 },
  contracts: { file: 'dist/index.js', budget: 5 },
  migration: { file: 'dist/index.js', budget: 14 },
  testing: { file: 'dist/index.js', budget: 10 },
  cli: { file: 'dist/cli.js', budget: 50 },
  devtools: { file: 'dist/index.js', budget: 22 },
  enterprise: { file: 'dist/index.js', budget: 25 },
  ai: { file: 'dist/index.js', budget: 20 },
  themes: { file: 'dist/index.js', budget: 5 },
  accessibility: { file: 'dist/index.js', budget: 5 },
};

let failed = false;

for (const [pkg, { file, budget }] of Object.entries(BUDGETS)) {
  const distFile = join(packagesDir, pkg, file);
  try {
    const info = await stat(distFile);
    const kb = info.size / 1024;
    if (kb > budget) {
      console.error(`FAIL @larose/${pkg}: ${kb.toFixed(1)}KB > ${budget}KB`);
      failed = true;
    } else {
      console.log(`OK   @larose/${pkg}: ${kb.toFixed(1)}KB / ${budget}KB`);
    }
  } catch {
    console.warn(`SKIP @larose/${pkg}: ${file} not found (run pnpm build)`);
  }
}

process.exit(failed ? 1 : 0);
