#!/usr/bin/env node
/**
 * Deprecate internal @larose-ui packages on npm (do not unpublish).
 * Requires NODE_AUTH_TOKEN / npm auth with publish rights on the org.
 */
import { listPackageDirs, isPublicPackage } from './public-surface.mjs';
import { spawnSync } from 'node:child_process';

const MESSAGE =
  process.env.LAROSE_DEPRECATE_MESSAGE ??
  'Internal building block for @larose-ui — do not install directly. Use @larose-ui/react (or vue/svelte) + styles. See https://hamdymohamedak.github.io/larose-ui/';

const packages = listPackageDirs()
  .filter((d) => !isPublicPackage(d))
  .sort()
  .map((d) => `@larose-ui/${d}`);

let failed = 0;
for (const pkg of packages) {
  console.log(`Deprecating ${pkg}...`);
  const result = spawnSync('npm', ['deprecate', pkg, MESSAGE], {
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  if (out) console.log(out);
  if (result.status !== 0) {
    const versionsResult = spawnSync('npm', ['view', pkg, 'versions', '--json'], {
      encoding: 'utf8',
      env: process.env,
    });
    let versions = [];
    try {
      const parsed = JSON.parse(versionsResult.stdout || '[]');
      versions = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      versions = [];
    }
    if (!versions.length) {
      console.error(`FAIL ${pkg}: not published or no versions`);
      failed += 1;
      continue;
    }
    let perFail = false;
    for (const ver of versions) {
      const r = spawnSync('npm', ['deprecate', `${pkg}@${ver}`, MESSAGE], {
        encoding: 'utf8',
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      const o = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
      if (o) console.log(o);
      if (r.status !== 0) perFail = true;
    }
    if (perFail) {
      console.error(`FAIL ${pkg}`);
      failed += 1;
    }
  }
}

if (failed) {
  console.error(`Done with ${failed} failure(s) out of ${packages.length}.`);
  process.exit(1);
}
console.log(`Done: deprecated ${packages.length} internal packages.`);
