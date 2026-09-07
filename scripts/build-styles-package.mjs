import { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { processModuleCssFile } from './build-css-package.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @param {string} dir @returns {string[]} */
function findModuleCssFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      findModuleCssFiles(full, results);
    } else if (entry.name.endsWith('.module.css')) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Resolve design-token CSS to prepend into the styles bundle.
 * Prefers built tokens dist, falls back to source.
 */
export function resolveTokensCssPath() {
  const distPath = join(repoRoot, 'packages/tokens/dist/styles.css');
  const srcPath = join(repoRoot, 'packages/tokens/src/styles.css');
  if (existsSync(distPath)) return distPath;
  if (existsSync(srcPath)) return srcPath;
  throw new Error(
    '[larose] @larose-ui/tokens styles.css is missing. Expected packages/tokens/dist/styles.css or src/styles.css.',
  );
}

/**
 * Bundle design tokens + scoped component CSS into a single stylesheet.
 * Apps only need: `import '@larose-ui/styles/styles.css'`
 * (or `@larose-ui/react/styles.css`, which copies this file).
 *
 * @param {string} packageRoot
 * @param {string} [outputName]
 */
export function writeStylesBundle(packageRoot, outputName = 'styles.css') {
  const tokensCss = readFileSync(resolveTokensCssPath(), 'utf8').trimEnd();
  const srcDir = join(packageRoot, 'src/components');
  const files = findModuleCssFiles(srcDir).sort();
  const componentsCss = files
    .map((file) => {
      const { scoped } = processModuleCssFile(file);
      const rel = file.slice(srcDir.length + 1);
      return `/* ${rel} */\n${scoped}`;
    })
    .join('\n\n');

  const css = [
    '/* @larose-ui/tokens (bundled) */',
    tokensCss,
    '',
    '/* @larose-ui/styles components */',
    componentsCss,
  ].join('\n');

  const distDir = join(packageRoot, 'dist');
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  writeFileSync(join(distDir, outputName), css);
}

/**
 * @param {string} packageRoot
 * @param {{ watch?: boolean }} [options]
 */
export async function buildStylesPackage(packageRoot, options = {}) {
  const result = spawnSync('pnpm', ['exec', 'tsup', 'src/index.ts', '--format', 'esm', '--dts', '--clean'], {
    cwd: packageRoot,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.warn('[larose] @larose-ui/styles DTS generation failed; CSS bundle will still be written.');
  }

  writeStylesBundle(packageRoot);

  const distDir = join(packageRoot, 'dist');
  const cssModulesTypes = join(packageRoot, 'src/css-modules.d.ts');
  if (existsSync(cssModulesTypes)) {
    cpSync(cssModulesTypes, join(distDir, 'css-modules.d.ts'));
    const indexDts = join(distDir, 'index.d.ts');
    if (existsSync(indexDts)) {
      const contents = readFileSync(indexDts, 'utf8');
      if (!contents.includes('css-modules.d.ts')) {
        writeFileSync(indexDts, `/// <reference path="./css-modules.d.ts" />\n${contents}`);
      }
    }
  }

  if (options.watch) {
    console.log('[larose] @larose-ui/styles CSS bundle written.');
  }
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);
const packageRoot = process.argv[2];
const watch = process.argv.includes('--watch');

if (isDirectRun && packageRoot) {
  await buildStylesPackage(packageRoot, { watch });
}
