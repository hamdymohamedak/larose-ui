import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(root, '..');
const runtimeSrc = join(packageRoot, 'src/runtime');
const runtimeDist = join(packageRoot, 'dist/runtime');

rmSync(runtimeDist, { recursive: true, force: true });
mkdirSync(runtimeDist, { recursive: true });
cpSync(runtimeSrc, runtimeDist, { recursive: true });

console.log('[larose/nuxt] Copied runtime assets to dist/runtime');
