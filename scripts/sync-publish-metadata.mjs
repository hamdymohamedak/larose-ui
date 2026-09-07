#!/usr/bin/env node
/**
 * Sync license, repository, publishConfig, and public-surface metadata
 * for all publishable @larose-ui/* packages.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPackageSurface, listPackageDirs } from './public-surface.mjs';

const REPO_URL = process.env.LAROSE_REPO_URL ?? 'https://github.com/hamdymohamedak/larose-ui';
const packagesDir = join(process.cwd(), 'packages');

for (const name of listPackageDirs(packagesDir)) {
  const pkgPath = join(packagesDir, name, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const surface = getPackageSurface(name);

  pkg.license = 'MIT';
  pkg.publishConfig = { access: 'public' };
  pkg.homepage = `${REPO_URL}/blob/main/packages/${name}#readme`;
  pkg.bugs = { url: `${REPO_URL}/issues` };
  pkg.repository = {
    type: 'git',
    url: `git+${REPO_URL}.git`,
    directory: `packages/${name}`,
  };

  pkg.larose = {
    ...(pkg.larose && typeof pkg.larose === 'object' ? pkg.larose : {}),
    publicApi: surface.publicApi,
    layer: surface.layer,
  };

  if (surface.publicApi) {
    pkg.description = surface.tagline;
    const keywords = new Set(pkg.keywords ?? ['larose', 'larose-ui', 'ui-platform', 'design-system', 'saas']);
    keywords.add('larose');
    keywords.add('larose-ui');
    keywords.add('larose-public');
    keywords.delete('larose-internal');
    pkg.keywords = [...keywords];
  } else {
    pkg.description = `[Internal] ${surface.tagline} Prefer @larose-ui/react, @larose-ui/vue, @larose-ui/svelte, or @larose-ui/runtime-* in apps.`;
    const keywords = new Set(pkg.keywords ?? ['larose', 'larose-ui']);
    keywords.add('larose');
    keywords.add('larose-ui');
    keywords.add('larose-internal');
    keywords.delete('larose-public');
    pkg.keywords = [...keywords];
  }

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(
    `Updated packages/${name}/package.json (${surface.publicApi ? 'public' : 'internal'}/${surface.layer})`,
  );
}
