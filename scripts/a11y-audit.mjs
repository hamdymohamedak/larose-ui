#!/usr/bin/env node
/**
 * Scan React component sources for accessibility issues.
 * Used locally and in CI as a lightweight a11y gate.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { scanComponentSource, formatA11yReport } from '@larose/accessibility';

const packagesDir = join(process.cwd(), 'packages');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

const reactDir = join(packagesDir, 'react', 'src');
const files = await walk(reactDir);
const allViolations = [];

for (const file of files) {
  if (file.includes('.test.')) continue;
  const source = await readFile(file, 'utf-8');
  const result = scanComponentSource(source, relative(process.cwd(), file));
  allViolations.push(...result.violations);
}

const passed = allViolations.filter((v) => v.severity === 'error').length === 0;
console.log(formatA11yReport({ passed, violations: allViolations }));
process.exit(passed ? 0 : 1);
