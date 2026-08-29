#!/usr/bin/env node
/**
 * Adds license, repository, and publishConfig to all publishable @larose-ui/* packages.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REPO_URL = process.env.LAROSE_REPO_URL ?? 'https://github.com/hamdymohamedak/larose-ui';
const packagesDir = join(process.cwd(), 'packages');

for (const name of readdirSync(packagesDir)) {
  const pkgPath = join(packagesDir, name, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  } catch {
    continue;
  }

  pkg.license = 'MIT';
  pkg.publishConfig = { access: 'public' };
  pkg.homepage = `${REPO_URL}/blob/main/packages/${name}#readme`;
  pkg.bugs = { url: `${REPO_URL}/issues` };
  pkg.repository = {
    type: 'git',
    url: `git+${REPO_URL}.git`,
    directory: `packages/${name}`,
  };
  if (!pkg.keywords) {
    pkg.keywords = ['larose', 'react', 'ui-platform', 'design-system', 'saas'];
  }

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`Updated packages/${name}/package.json`);
}
