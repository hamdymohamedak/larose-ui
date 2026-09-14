import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractComponentContracts,
  extractMergedComponentContracts,
} from './lib/extract-component-api.mjs';
import { COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';
import { isGlassDocComponent } from './lib/glass-components.mjs';
import {
  INTENTIONAL_ADAPTER_ASYMMETRIES,
  listFrameworkComponentExports,
  resolveAdapterIndexPath,
  resolveLiquidGlassIndexPath,
  resolvePropsSampleAdapter,
} from './lib/component-catalog.mjs';
import {
  compareComponentContracts,
  validateComponentContractSchema,
  isComponentContract,
} from '../packages/contracts/dist/index.js';
import { existsSync } from 'node:fs';

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

const names = canonicalFiles.map((file) => file.replace(/\.json$/, ''));
const glassNames = names.filter(isGlassDocComponent);
const mainNames = names.filter((name) => !isGlassDocComponent(name));

const liveContracts = extractMergedComponentContracts(
  root,
  mainNames,
  COMPONENT_ANATOMY,
  (fw) => {
    const path = resolveAdapterIndexPath(root, fw);
    return existsSync(path) ? path : '';
  },
);
Object.assign(
  liveContracts,
  extractMergedComponentContracts(root, glassNames, COMPONENT_ANATOMY, (fw) => {
    const path = resolveLiquidGlassIndexPath(root, fw);
    return existsSync(path) ? path : '';
  }),
);

const exportsByFramework = listFrameworkComponentExports(root);
const exportSets = {
  react: new Set(exportsByFramework.react),
  vue: new Set(exportsByFramework.vue),
  svelte: new Set(exportsByFramework.svelte),
};

const sampleAdapter = resolvePropsSampleAdapter(root, 'auto');

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

  if (!INTENTIONAL_ADAPTER_ASYMMETRIES.has(componentName)) {
    for (const framework of /** @type {const} */ (['react', 'vue', 'svelte'])) {
      if (!exportSets[framework].has(componentName)) {
        diagnostics.push({
          severity: 'warning',
          message: `${componentName}: missing export in ${framework} adapter (contract is canonical)`,
          file: join('contracts/components', file),
          fix: `Export ${componentName} from @larose-ui/${framework === 'react' ? 'react' : framework} or mark intentional asymmetry`,
        });
      }
    }
  }

  const implementation = liveContracts[componentName];
  if (!implementation) {
    diagnostics.push({
      severity: 'warning',
      message: `No live Props sample found for contract "${componentName}" (merged adapters; fallback sample ${sampleAdapter})`,
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
          : 'Align adapter implementations with contracts/components canonical API',
    });
  }
}

console.log(JSON.stringify({ diagnostics }));
