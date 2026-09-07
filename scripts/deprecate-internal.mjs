#!/usr/bin/env node
/**
 * Deprecate internal @larose-ui packages on npm (do not unpublish).
 * Requires NODE_AUTH_TOKEN / npm auth with publish rights on the org.
 *
 * Self-contained so it can run on branches that do not yet include public-surface.mjs.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MESSAGE =
  process.env.LAROSE_DEPRECATE_MESSAGE ??
  'Internal building block for @larose-ui — do not install directly. Use @larose-ui/react (or vue/svelte) + styles. See https://hamdymohamedak.github.io/larose-ui/';

/** Fallback list if public-surface.mjs is unavailable. */
const FALLBACK_INTERNAL = [
  'accessibility',
  'ai-core',
  'component-logic',
  'contracts',
  'core',
  'data-core',
  'devtools-core',
  'enterprise-core',
  'forms-core',
  'liquid-glass-core',
  'migration',
  'network',
  'observability-core',
  'offline',
  'permissions-core',
  'primitives',
  'quality-core',
  'runtime-core',
  'testing-core',
  'tokens',
];

async function resolveInternalPackages() {
  const surfacePath = new URL('./public-surface.mjs', import.meta.url);
  try {
    if (existsSync(surfacePath)) {
      const { listPackageDirs, isPublicPackage } = await import(surfacePath.href);
      return listPackageDirs()
        .filter((d) => !isPublicPackage(d))
        .sort()
        .map((d) => `@larose-ui/${d}`);
    }
  } catch {
    // fall through
  }

  const packagesDir = join(process.cwd(), 'packages');
  if (existsSync(packagesDir)) {
    const dirs = readdirSync(packagesDir).filter((name) => {
      try {
        const pkg = JSON.parse(readFileSync(join(packagesDir, name, 'package.json'), 'utf8'));
        return typeof pkg.name === 'string' && pkg.name.startsWith('@larose-ui/') && !pkg.private;
      } catch {
        return false;
      }
    });
    const known = new Set(FALLBACK_INTERNAL);
    return dirs.filter((d) => known.has(d)).sort().map((d) => `@larose-ui/${d}`);
  }

  return FALLBACK_INTERNAL.map((d) => `@larose-ui/${d}`);
}

function npm(args) {
  return spawnSync('npm', args, {
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

const packages = await resolveInternalPackages();
let failed = 0;

for (const pkg of packages) {
  console.log(`Deprecating ${pkg}...`);
  const result = npm(['deprecate', pkg, MESSAGE]);
  const out = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  if (out) console.log(out);
  if (result.status === 0) continue;

  const versionsResult = npm(['view', pkg, 'versions', '--json']);
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
    const r = npm(['deprecate', `${pkg}@${ver}`, MESSAGE]);
    const o = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
    if (o) console.log(o);
    if (r.status !== 0) perFail = true;
  }
  if (perFail) {
    console.error(`FAIL ${pkg}`);
    failed += 1;
  }
}

if (failed) {
  console.error(`Done with ${failed} failure(s) out of ${packages.length}.`);
  process.exit(1);
}
console.log(`Done: deprecated ${packages.length} internal packages.`);
