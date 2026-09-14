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
 * Props are sampled from all three adapters and merged (richest wins per component),
 * then neutralized (no onXxx props, className, or children slots).
 * No framework is the architectural source of truth.
 *
 * Optional `--from=react|vue|svelte` forces a single sample source (debugging only).
 */
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractComponentContracts,
  extractMergedComponentContracts,
} from './lib/extract-component-api.mjs';
import { isGlassDocComponent } from './lib/glass-components.mjs';
import { COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';
import {
  listContractCatalog,
  resolveAdapterIndexPath,
  resolveLiquidGlassIndexPath,
} from './lib/component-catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const fromArg = process.argv.find((arg) => arg.startsWith('--from='));
const preferred = fromArg ? fromArg.slice('--from='.length) : 'merge';

const catalog = listContractCatalog(root);
const glassNames = catalog.filter(isGlassDocComponent);
const mainNames = catalog.filter((name) => !isGlassDocComponent(name));

/** @type {Record<string, import('../packages/contracts/src/types.ts').ComponentContract>} */
let contracts;

if (preferred === 'merge' || preferred === 'auto') {
  contracts = extractMergedComponentContracts(
    root,
    mainNames,
    COMPONENT_ANATOMY,
    (fw) => {
      const path = resolveAdapterIndexPath(root, fw);
      return existsSync(path) ? path : '';
    },
  );
  Object.assign(
    contracts,
    extractMergedComponentContracts(root, glassNames, COMPONENT_ANATOMY, (fw) => {
      const path = resolveLiquidGlassIndexPath(root, fw);
      return existsSync(path) ? path : '';
    }),
  );
} else {
  const sampleAdapter = /** @type {'react'|'vue'|'svelte'} */ (preferred);
  const sampleIndexPath = resolveAdapterIndexPath(root, sampleAdapter);
  const liquidGlassIndexPath = resolveLiquidGlassIndexPath(root, sampleAdapter);
  contracts = extractComponentContracts(
    root,
    mainNames,
    COMPONENT_ANATOMY,
    'neutral',
    sampleIndexPath,
  );
  Object.assign(
    contracts,
    extractComponentContracts(
      root,
      glassNames,
      COMPONENT_ANATOMY,
      'neutral',
      liquidGlassIndexPath,
    ),
  );
}

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
  `[larose] wrote ${written} component contracts (canonical JSON; sample mode=${preferred}, neutralized)`,
);
if (removed > 0) {
  console.log(`[larose] removed ${removed} stale component contracts`);
}
