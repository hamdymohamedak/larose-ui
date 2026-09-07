#!/usr/bin/env node
/**
 * Verify all @larose-ui/* packages are ready for npm publish,
 * including public-surface metadata consistency.
 */
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getPackageSurface, listPackageDirs, PUBLIC_PACKAGES } from './public-surface.mjs';

const packagesDir = join(process.cwd(), 'packages');
let failed = false;

for (const name of listPackageDirs(packagesDir)) {
  const pkgPath = join(packagesDir, name, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const label = `@larose-ui/${name}`;
  const surface = getPackageSurface(name);

  if (!pkg.license) {
    console.error(`FAIL ${label}: missing license`);
    failed = true;
  }

  if (!pkg.publishConfig?.access) {
    console.error(`FAIL ${label}: missing publishConfig.access`);
    failed = true;
  }

  if (pkg.larose?.publicApi !== surface.publicApi) {
    console.error(
      `FAIL ${label}: larose.publicApi=${pkg.larose?.publicApi} (expected ${surface.publicApi}). Run pnpm sync:publish-metadata`,
    );
    failed = true;
  }

  if (pkg.larose?.layer !== surface.layer) {
    console.error(
      `FAIL ${label}: larose.layer=${pkg.larose?.layer} (expected ${surface.layer}). Run pnpm sync:publish-metadata`,
    );
    failed = true;
  }

  if (surface.publicApi && !pkg.keywords?.includes('larose-public')) {
    console.error(`FAIL ${label}: public package missing keyword larose-public`);
    failed = true;
  }

  if (!surface.publicApi && !pkg.keywords?.includes('larose-internal')) {
    console.error(`FAIL ${label}: internal package missing keyword larose-internal`);
    failed = true;
  }

  if (!surface.publicApi && !String(pkg.description ?? '').startsWith('[Internal]')) {
    console.error(`FAIL ${label}: internal package description must start with [Internal]`);
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
      console.log(`OK   ${label} v${pkg.version} — ${surface.publicApi ? 'public' : 'internal'}/${surface.layer}`);
    } catch {
      console.error(`FAIL ${label}: missing build output (${output})`);
      failed = true;
    }
  }
}

for (const name of Object.keys(PUBLIC_PACKAGES)) {
  try {
    readFileSync(join(packagesDir, name, 'package.json'), 'utf-8');
  } catch {
    console.error(`FAIL public surface lists missing package: ${name}`);
    failed = true;
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
