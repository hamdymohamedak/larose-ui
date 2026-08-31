import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { processModuleCssFile } from './build-css-package.mjs';

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
 * Bundle scoped component CSS modules into a single stylesheet.
 * @param {string} packageRoot
 * @param {string} [outputName]
 */
export function writeStylesBundle(packageRoot, outputName = 'styles.css') {
  const srcDir = join(packageRoot, 'src/components');
  const files = findModuleCssFiles(srcDir).sort();
  const css = files
    .map((file) => {
      const { scoped } = processModuleCssFile(file);
      const rel = file.slice(srcDir.length + 1);
      return `/* ${rel} */\n${scoped}`;
    })
    .join('\n\n');

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
