import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Resolve `@larose-ui/styles/components/...` imports to absolute paths. */
export function resolveStylesModuleImport(importPath) {
  if (!importPath.startsWith('@larose-ui/styles/components/')) {
    return null;
  }

  const relative = importPath.slice('@larose-ui/styles/'.length);
  const stylesRoot = join(repoRoot, 'packages/styles');
  const candidate = join(stylesRoot, 'src', relative);

  if (existsSync(candidate)) {
    return candidate;
  }

  return null;
}

/**
 * Copy bundled `@larose-ui/styles` CSS into a framework package `dist/index.css`
 * so `./styles.css` exports match the stable `lr-*` class names used in JS.
 */
export function syncFrameworkStylesCss(packageRoot) {
  const source = join(repoRoot, 'packages/styles/dist/styles.css');
  const target = join(packageRoot, 'dist/index.css');

  if (!existsSync(source)) {
    throw new Error(
      '[larose] @larose-ui/styles/dist/styles.css is missing. Build @larose-ui/styles before framework packages.',
    );
  }

  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target);
}

/** @deprecated Prefer syncFrameworkStylesCss */
export function syncReactStylesCss(reactPackageRoot) {
  syncFrameworkStylesCss(reactPackageRoot);
}

/**
 * Vite CSS modules config — same `lr-Module-class` contract as React / Storybook.
 * @returns {{ generateScopedName: (name: string, filename: string) => string }}
 */
export function laroseCssModules() {
  return {
    generateScopedName(name, filename) {
      const moduleName = basename(filename, '.module.css');
      return `lr-${moduleName}-${name}`;
    },
  };
}
