#!/usr/bin/env node
/**
 * Visual regression gate — validates Storybook story manifest against baseline.
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const cli = join(process.cwd(), 'packages/cli/dist/cli.js');
const result = spawnSync(process.execPath, [cli, 'visual-regression'], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
