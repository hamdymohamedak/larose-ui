#!/usr/bin/env node
/**
 * Verify all @larose-ui/* packages are ready for npm publish.
 */
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const packagesDir = join(process.cwd(), 'packages');
let failed = false;

for (const name of readdirSync(packagesDir)) {
  const pkgPath = join(packagesDir, name, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  } catch {
    continue;
  }

  const label = `@larose-ui/${name}`;

  if (!pkg.license) {
    console.error(`FAIL ${label}: missing license`);
    failed = true;
  }

  if (!pkg.publishConfig?.access) {
    console.error(`FAIL ${label}: missing publishConfig.access`);
    failed = true;
  }

  const distMain = join(packagesDir, name, pkg.main?.replace('./', '') ?? 'dist/index.js');
  const binPaths =
    pkg.bin && typeof pkg.bin === 'object'
      ? Object.values(pkg.bin).map((p) => join(packagesDir, name, String(p).replace('./', '')))
      : [];

  const outputs = pkg.main ? [distMain] : binPaths.length > 0 ? binPaths : [distMain];

  for (const output of outputs) {
    try {
      statSync(output);
      console.log(`OK   ${label} v${pkg.version} — ${output}`);
    } catch {
      console.error(`FAIL ${label}: missing build output (${output})`);
      failed = true;
    }
  }
}

const playground = JSON.parse(readFileSync(join(process.cwd(), 'apps/playground/package.json'), 'utf-8'));
if (!playground.private) {
  console.error('FAIL @larose-ui/playground must remain private');
  failed = true;
} else {
  console.log('OK   @larose-ui/playground is private');
}

const demo = JSON.parse(readFileSync(join(process.cwd(), 'apps/demo/package.json'), 'utf-8'));
if (!demo.private) {
  console.error('FAIL @larose-ui/demo must remain private');
  failed = true;
} else {
  console.log('OK   @larose-ui/demo is private');
}

process.exit(failed ? 1 : 0);
