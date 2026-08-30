import { readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { basename, join, isAbsolute } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as esbuild from 'esbuild';

const CLASS_RE = /\.([a-zA-Z_][\w-]*)/g;

/** @param {string} css */
function extractClassNames(css) {
  const names = new Set();
  for (const match of css.matchAll(CLASS_RE)) {
    names.add(match[1]);
  }
  return [...names];
}

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
 * @param {string | undefined} packageRoot
 */
export function cssModulesPlugin(packageRoot) {
  return {
    name: 'larose-css-modules',
    setup(build) {
      build.onResolve({ filter: /\.module\.css$/ }, (args) => {
        const resolvedPath = isAbsolute(args.path)
          ? args.path
          : join(args.resolveDir, args.path);

        return {
          path: resolvedPath,
          namespace: 'larose-css-module',
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'larose-css-module' }, async (args) => {
        const css = readFileSync(args.path, 'utf8');
        const classNames = extractClassNames(css);
        const exports = Object.fromEntries(classNames.map((name) => [name, name]));

        return {
          contents: `export default ${JSON.stringify(exports)};`,
          loader: 'js',
        };
      });

      if (packageRoot) {
        build.onEnd(() => {
          writeBundledCss(packageRoot);
        });
      }
    },
  };
}

/** Strip CSS Modules :global() wrappers for the concatenated stylesheet. */
function flattenCssModulesForBundle(css) {
  return css.replace(/:global\(([^)]+)\)/g, '$1');
}

/** @param {string} packageRoot */
export function writeBundledCss(packageRoot) {
  const srcDir = join(packageRoot, 'src');
  const files = findModuleCssFiles(srcDir).sort();
  const css = files
    .map(
      (file) =>
        `/* ${basename(file)} */\n${flattenCssModulesForBundle(readFileSync(file, 'utf8'))}`,
    )
    .join('\n\n');
  writeFileSync(join(packageRoot, 'dist/index.css'), css);
}

/** @param {string} packageRoot */
function getExternal(packageRoot) {
  const pkg = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];
}

/** @param {string} packageRoot */
function emitDeclarationFiles(packageRoot) {
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsup', 'src/index.ts', '--format', 'esm', '--dts-only'],
    { cwd: packageRoot, stdio: 'inherit' },
  );
  if (result.status !== 0) {
    console.warn('[larose] DTS generation failed; JS/CSS bundle was still written.');
  }
}

/**
 * @param {string} packageRoot
 * @param {{ watch?: boolean }} options
 */
export async function buildCssPackage(packageRoot, options = {}) {
  const external = getExternal(packageRoot);
  const distDir = join(packageRoot, 'dist');

  if (!options.watch && existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }

  const buildOptions = {
    entryPoints: [join(packageRoot, 'src/index.ts')],
    outfile: join(distDir, 'index.js'),
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    plugins: [cssModulesPlugin(packageRoot)],
    external,
    banner: { js: "import './index.css';" },
    logLevel: 'info',
  };

  if (options.watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    writeBundledCss(packageRoot);
    emitDeclarationFiles(packageRoot);
    console.log('[larose] watching for changes…');
    return;
  }

  await esbuild.build(buildOptions);
  writeBundledCss(packageRoot);
  emitDeclarationFiles(packageRoot);
}

const packageRoot = process.argv[2];
const watch = process.argv.includes('--watch');

if (packageRoot) {
  await buildCssPackage(packageRoot, { watch });
}
