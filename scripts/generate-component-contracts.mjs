/**
 * Component contracts (`contracts/components/*.json`) are the canonical, framework-neutral API.
 *
 * Architecture:
 *   Framework-neutral contract (JSON)
 *            │
 *      ┌─────┼─────┐
 *      ▼     ▼     ▼
 *   React   Vue   Svelte
 *
 * This script refreshes JSON by sampling Props types from a reference adapter
 * (`--from=react|vue|svelte|auto`). The sample adapter is an authoring aid only —
 * React is not the architectural source of truth.
 *
 * Catalog = existing contracts ∪ components exported by all three UI adapters.
 */
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractComponentContracts } from './lib/extract-component-api.mjs';
import { isGlassDocComponent } from './lib/glass-components.mjs';
import { COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';
import {
  listContractCatalog,
  resolveAdapterIndexPath,
  resolvePropsSampleAdapter,
} from './lib/component-catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const fromArg = process.argv.find((arg) => arg.startsWith('--from='));
const preferred = /** @type {'react' | 'vue' | 'svelte' | 'auto'} */ (
  fromArg ? fromArg.slice('--from='.length) : 'auto'
);
const sampleAdapter = resolvePropsSampleAdapter(root, preferred);
const sampleIndexPath = resolveAdapterIndexPath(root, sampleAdapter);
const liquidGlassIndexPath = join(root, 'packages/react/src/LiquidGlass/index.ts');

const catalog = listContractCatalog(root);
const glassNames = catalog.filter(isGlassDocComponent);
const mainNames = catalog.filter((name) => !isGlassDocComponent(name));

const contracts = extractComponentContracts(
  root,
  mainNames,
  COMPONENT_ANATOMY,
  'neutral',
  sampleIndexPath,
);
Object.assign(
  contracts,
  extractComponentContracts(root, glassNames, COMPONENT_ANATOMY, 'neutral', liquidGlassIndexPath),
);

const outDir = join(root, 'contracts/components');
mkdirSync(outDir, { recursive: true });

const liveNames = new Set(Object.keys(contracts));
let written = 0;
for (const [name, contract] of Object.entries(contracts)) {
  const filePath = join(outDir, `${name}.json`);
  writeFileSync(filePath, `${JSON.stringify(contract, null, 2)}\n`);
  written += 1;
}

let removed = 0;
for (const file of readdirSync(outDir)) {
  if (!file.endsWith('.json')) continue;
  const name = file.replace(/\.json$/, '');
  if (liveNames.has(name)) continue;
  unlinkSync(join(outDir, file));
  removed += 1;
}

console.log(
  `[larose] wrote ${written} component contracts (canonical JSON; props sampled from ${sampleAdapter})`,
);
if (removed > 0) {
  console.log(`[larose] removed ${removed} stale component contracts`);
}
