import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractComponentContracts, listComponentNames } from './lib/extract-component-api.mjs';
import { COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';
import { isGlassDocComponent } from './lib/glass-components.mjs';
import {
  compareComponentContracts,
  validateComponentContractSchema,
  isComponentContract,
} from '../packages/contracts/dist/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'contracts/components');

/** @type {Array<{ severity: 'error' | 'warning'; message: string; file?: string; fix?: string }>} */
const diagnostics = [];

let canonicalFiles = [];
try {
  canonicalFiles = readdirSync(componentsDir).filter((file) => file.endsWith('.json'));
} catch {
  console.log(JSON.stringify({ diagnostics }));
  process.exit(0);
}

if (canonicalFiles.length === 0) {
  console.log(JSON.stringify({ diagnostics }));
  process.exit(0);
}

const names = listComponentNames(root);
const liveContracts = extractComponentContracts(root, names, COMPONENT_ANATOMY, 'neutral');

const liquidGlassIndexPath = join(root, 'packages/react/src/LiquidGlass/index.ts');
const glassNames = canonicalFiles
  .map((file) => file.replace(/\.json$/, ''))
  .filter(isGlassDocComponent);

if (glassNames.length > 0) {
  Object.assign(
    liveContracts,
    extractComponentContracts(root, glassNames, COMPONENT_ANATOMY, 'neutral', liquidGlassIndexPath),
  );
}

for (const file of canonicalFiles) {
  const componentName = file.replace(/\.json$/, '');
  const canonical = JSON.parse(readFileSync(join(componentsDir, file), 'utf8'));

  const schemaResult = validateComponentContractSchema(canonical);
  for (const mismatch of schemaResult.mismatches) {
    diagnostics.push({
      severity: mismatch.severity,
      message: `${componentName}: ${mismatch.message}`,
      file: join('contracts/components', file),
    });
  }

  if (!schemaResult.valid || !isComponentContract(canonical)) continue;

  const implementation = liveContracts[componentName];
  if (!implementation) {
    diagnostics.push({
      severity: 'warning',
      message: `No live React implementation found for contract "${componentName}"`,
      file: join('contracts/components', file),
    });
    continue;
  }

  const parity = compareComponentContracts(implementation, canonical);
  for (const mismatch of parity.mismatches) {
    diagnostics.push({
      severity: mismatch.severity,
      message: `${componentName}: ${mismatch.message}`,
      file: join('contracts/components', file),
      fix:
        mismatch.issue === 'extra_prop' || mismatch.issue === 'default_mismatch'
          ? 'Update contract via pnpm generate:contracts if intentional'
          : 'Align React implementation with contracts/components canonical API',
    });
  }
}

console.log(JSON.stringify({ diagnostics }));
