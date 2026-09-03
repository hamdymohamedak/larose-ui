import { mkdirSync, writeFileSync } from 'node:fs';
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

let written = 0;
for (const [name, contract] of Object.entries(contracts)) {
  const filePath = join(outDir, `${name}.json`);
  writeFileSync(filePath, `${JSON.stringify(contract, null, 2)}\n`);
  written += 1;
}

console.log(`[larose] wrote ${written} component contracts to contracts/components/`);
