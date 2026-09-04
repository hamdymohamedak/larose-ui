#!/usr/bin/env node
/**
 * CI gate: every shared three-framework *root* component must be Storybook-covered
 * (hand-written registry, generated auto-scaffold, or explicit needs-demo allowlist).
 *
 * Compound anatomy, icons, and providers are reported as skipped — not failures.
 *
 * Usage:
 *   node scripts/check-storybook-coverage.mjs
 *   node scripts/check-storybook-coverage.mjs --json
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStorybookCatalog, STORYBOOK_NEEDS_DEMO } from './lib/storybook-catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsonMode = process.argv.includes('--json');

const catalog = buildStorybookCatalog(root);
const generatedPath = join(
  root,
  'apps/playground/.storybook/crossFramework/registry/generated.tsx',
);

/** @type {Set<string>} */
const generatedNames = new Set();
if (existsSync(generatedPath)) {
  const source = readFileSync(generatedPath, 'utf8');
  for (const match of source.matchAll(/displayName:\s*'([^']+)'/g)) {
    generatedNames.add(match[1]);
  }
}

const missing = catalog.uncoveredRoots.filter(
  (entry) => !generatedNames.has(entry.name) && !STORYBOOK_NEEDS_DEMO.has(entry.name),
);

const staleNeedsDemo = [...STORYBOOK_NEEDS_DEMO].filter((name) => {
  const entry = catalog.components.find((c) => c.name === name);
  return entry?.covered || generatedNames.has(name);
});

/** @type {Array<{ severity: 'error' | 'warning' | 'info'; message: string; fix?: string }>} */
const diagnostics = [];

for (const entry of missing) {
  diagnostics.push({
    severity: 'error',
    message: `Shared root component "${entry.name}" is not in Storybook (no hand-written registry, generated entry, or STORYBOOK_NEEDS_DEMO allowlist).`,
    fix: `Run \`pnpm generate:storybook-parity\`, add a registry entry with displayName: '${entry.name}', or add it to STORYBOOK_NEEDS_DEMO in scripts/lib/storybook-catalog.mjs until a demo exists.`,
  });
}

for (const name of staleNeedsDemo) {
  diagnostics.push({
    severity: 'warning',
    message: `"${name}" is in STORYBOOK_NEEDS_DEMO but already covered — remove it from the allowlist.`,
  });
}

const skipped = catalog.components.filter((c) => c.kind !== 'root');
const rootsCovered = catalog.components.filter(
  (c) =>
    c.kind === 'root' &&
    (c.covered || generatedNames.has(c.name) || STORYBOOK_NEEDS_DEMO.has(c.name)),
).length;
const rootTotal = catalog.components.filter((c) => c.kind === 'root').length;

if (!jsonMode) {
  console.log(
    `[larose] storybook coverage: shared=${catalog.sharedCount} rootsCovered=${rootsCovered}/${rootTotal} auto=${generatedNames.size} needsDemo=${STORYBOOK_NEEDS_DEMO.size} skipped=${skipped.length}`,
  );
  for (const d of diagnostics) {
    const stream = d.severity === 'error' ? console.error : console.warn;
    stream(`${d.severity}: ${d.message}`);
    if (d.fix) stream(`  fix: ${d.fix}`);
  }
  if (diagnostics.filter((d) => d.severity === 'error').length === 0) {
    console.log('[larose] storybook coverage OK');
  }
} else {
  console.log(
    JSON.stringify(
      {
        ok: diagnostics.every((d) => d.severity !== 'error'),
        sharedCount: catalog.sharedCount,
        missing: missing.map((m) => m.name),
        generated: [...generatedNames].sort(),
        needsDemo: [...STORYBOOK_NEEDS_DEMO].sort(),
        skipped: skipped.map((s) => ({ name: s.name, kind: s.kind })),
        diagnostics,
      },
      null,
      2,
    ),
  );
}

process.exit(diagnostics.some((d) => d.severity === 'error') ? 1 : 0);
