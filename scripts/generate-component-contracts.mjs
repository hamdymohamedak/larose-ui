import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractComponentContracts, listComponentNames } from './lib/extract-component-api.mjs';
import { COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentNames = listComponentNames(root);
const contracts = extractComponentContracts(root, componentNames, COMPONENT_ANATOMY, 'react');
const outDir = join(root, 'contracts/components');
mkdirSync(outDir, { recursive: true });

let written = 0;
for (const [name, contract] of Object.entries(contracts)) {
  const filePath = join(outDir, `${name}.json`);
  writeFileSync(filePath, `${JSON.stringify(contract, null, 2)}\n`);
  written += 1;
}

console.log(`[larose] wrote ${written} component contracts to contracts/components/`);
