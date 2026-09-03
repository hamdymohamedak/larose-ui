import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractComponentContracts } from './lib/extract-component-api.mjs';
import { parseComponentExportsFromIndex } from './lib/parse-index-exports.mjs';
import { isGlassDocComponent } from './lib/glass-components.mjs';
import { COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const reactIndexPath = join(root, 'packages/react/src/index.ts');
const liquidGlassIndexPath = join(root, 'packages/react/src/LiquidGlass/index.ts');
const reactNames = parseComponentExportsFromIndex(reactIndexPath);
const glassNames = reactNames.filter(isGlassDocComponent);

const contracts = extractComponentContracts(root, reactNames, COMPONENT_ANATOMY, 'react', reactIndexPath);
Object.assign(
  contracts,
  extractComponentContracts(root, glassNames, COMPONENT_ANATOMY, 'react', liquidGlassIndexPath),
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

console.log(`[larose] wrote ${written} component contracts to contracts/components/`);
if (removed > 0) {
  console.log(`[larose] removed ${removed} stale component contracts`);
}
