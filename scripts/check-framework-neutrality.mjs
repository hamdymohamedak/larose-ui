#!/usr/bin/env node
/**
 * Fail if framework-agnostic packages depend on React / Vue / Svelte.
 * Usage: node scripts/check-framework-neutrality.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = join(root, 'packages');

/** Packages that must remain framework-free. */
const CORE_PACKAGES = new Set([
  'core',
  'tokens',
  'styles',
  'themes',
  'primitives',
  'component-logic',
  'liquid-glass-core',
  'forms-core',
  'data-core',
  'permissions-core',
  'observability-core',
  'runtime-core',
  'devtools-core',
  'quality-core',
  'network',
  'offline',
  'accessibility',
  // `migration` intentionally emits framework import strings in scaffolds/codemods —
  // it is multi-target tooling, not a runtime core. Still no react/vue/svelte deps.
  'contracts',
  'cli',
  'ai-core',
  'enterprise-core',
  'testing-core',
]);

const FORBIDDEN = /^(react|react-dom|vue|svelte|@larose-ui\/(react|vue|svelte|runtime-react|forms-react|data-react|permissions-react|observability-react|ai-react|enterprise-react|testing-react|devtools-react|runtime|forms|data|permissions|observability|ai|enterprise|testing|devtools|next|nuxt|sveltekit))$/;

const errors = [];

for (const dir of readdirSync(packagesDir)) {
  if (!CORE_PACKAGES.has(dir) && !dir.endsWith('-core')) continue;
  if (!CORE_PACKAGES.has(dir) && dir.endsWith('-core')) {
    // auto-include any *-core package
  } else if (!CORE_PACKAGES.has(dir)) {
    continue;
  }

  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const buckets = {
    dependencies: pkg.dependencies ?? {},
    peerDependencies: pkg.peerDependencies ?? {},
    optionalDependencies: pkg.optionalDependencies ?? {},
    devDependencies: pkg.devDependencies ?? {},
  };

  for (const [bucket, deps] of Object.entries(buckets)) {
    // Allow typescript/vitest/etc. Only flag framework runtime deps.
    // DevDeps: still forbid react/vue/svelte for *-core so cores cannot accidentally import them.
    for (const name of Object.keys(deps)) {
      if (FORBIDDEN.test(name)) {
        errors.push(
          `${pkg.name}: ${bucket} includes forbidden framework package "${name}"`,
        );
      }
    }
  }

  // Scan src for import 'react' | 'vue' | 'svelte'
  const srcDir = join(packagesDir, dir, 'src');
  if (existsSync(srcDir)) {
    scanImports(srcDir, pkg.name, errors);
  }
}

function scanImports(dir, pkgName, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanImports(full, pkgName, out);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs|cjs)$/.test(entry.name)) continue;
    const text = readFileSync(full, 'utf8');
    if (
      /\bfrom\s+['"]react(?:-dom)?['"]/.test(text) ||
      /\bfrom\s+['"]vue['"]/.test(text) ||
      /\bfrom\s+['"]svelte(?:\/|$)/.test(text) ||
      /\bfrom\s+['"]@larose-ui\/(?:react|vue|svelte)['"]/.test(text)
    ) {
      out.push(`${pkgName}: framework import in ${full.replace(root + '/', '')}`);
    }
  }
}

if (errors.length) {
  console.error('[framework-neutrality] FAILED\n');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `[framework-neutrality] OK — checked ${CORE_PACKAGES.size}+ core packages for framework leakage`,
);
