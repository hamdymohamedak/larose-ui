/**
 * Validate contracts/parity/matrix.json against skill §18 expectations.
 * Fails (exit 1) when a shared three-way component has any `fail` behavior,
 * or when overlay components lack portal/motion pass.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTENTIONAL_ADAPTER_ASYMMETRIES } from './lib/component-catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrixPath = join(root, 'contracts/parity/matrix.json');

if (!existsSync(matrixPath)) {
  console.error('[larose] missing contracts/parity/matrix.json — run pnpm generate:parity-matrix');
  process.exit(1);
}

const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

const OVERLAYS = new Set(['Modal', 'Dialog', 'AlertDialog', 'Drawer', 'Popover', 'CommandPalette']);

for (const entry of matrix.entries ?? []) {
  const { component, frameworks, behaviors } = entry;
  if (INTENTIONAL_ADAPTER_ASYMMETRIES.has(component)) continue;

  const allThree = frameworks.react && frameworks.vue && frameworks.svelte;
  if (!allThree) {
    errors.push(`${component}: missing framework export(s) ${JSON.stringify(frameworks)}`);
    continue;
  }

  for (const [behavior, status] of Object.entries(behaviors ?? {})) {
    if (status === 'fail') {
      errors.push(`${component}.${behavior}: fail`);
    }
  }

  if (OVERLAYS.has(component)) {
    if (component === 'Popover' && behaviors.portal === 'n/a') {
      // intentional
    } else if (behaviors.portal === 'fail') {
      errors.push(`${component}.portal must not fail for overlay components`);
    }
    if (behaviors.motion === 'fail') {
      errors.push(`${component}.motion must not fail for overlay components`);
    }
    if (
      component !== 'Popover' &&
      (behaviors.portal === 'unverified' || behaviors.motion === 'unverified')
    ) {
      warnings.push(`${component}: overlay portal/motion still unverified`);
    }
    if (component === 'Popover' && behaviors.motion === 'unverified') {
      warnings.push(`${component}: overlay motion still unverified`);
    }
  }
}

if (warnings.length) {
  console.warn(`[larose] parity matrix warnings (${warnings.length}):`);
  for (const w of warnings.slice(0, 40)) console.warn(`  - ${w}`);
  if (warnings.length > 40) console.warn(`  … +${warnings.length - 40} more`);
}

if (errors.length) {
  console.error(`[larose] parity matrix errors (${errors.length}):`);
  for (const e of errors.slice(0, 60)) console.error(`  - ${e}`);
  if (errors.length > 60) console.error(`  … +${errors.length - 60} more`);
  process.exit(1);
}

console.log(
  `[larose] parity matrix ok (${matrix.entries?.length ?? 0} components, ${warnings.length} warnings)`,
);
