import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
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

/** Copy bundled styles into react dist for backward-compatible `./styles.css` export. */
export function syncReactStylesCss(reactPackageRoot) {
  const source = join(repoRoot, 'packages/styles/dist/styles.css');
  const target = join(reactPackageRoot, 'dist/index.css');

  if (!existsSync(source)) {
    throw new Error(
      '[larose] @larose-ui/styles/dist/styles.css is missing. Build @larose-ui/styles before @larose-ui/react.',
    );
  }

  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target);
}
