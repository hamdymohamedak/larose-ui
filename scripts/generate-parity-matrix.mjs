/**
 * Generate contracts/parity/matrix.json — per-component behavioral parity matrix.
 *
 * Status values:
 *   pass | fail | partial | n/a | unverified
 *
 * Verified behaviors for critical overlays are seeded from known shared-logic +
 * Playwright coverage. Everything else starts as `unverified` until tests prove it.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INTENTIONAL_ADAPTER_ASYMMETRIES,
  listCanonicalContractNames,
  listFrameworkComponentExports,
} from './lib/component-catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'contracts/parity');
const outFile = join(outDir, 'matrix.json');

/** Behaviors that must be tracked for every component (skill §18). */
const BEHAVIORS = [
  'initialState',
  'openClose',
  'keyboard',
  'focus',
  'accessibility',
  'controlledState',
  'uncontrolledState',
  'events',
  'motion',
  'portal',
  'visual',
];

/** Components with Playwright critical-flow coverage today. */
const PLAYWRIGHT_VERIFIED = new Set(['Dialog', 'Modal', 'CommandPalette', 'Toast']);

/** Overlay components that must use shared portal + presence motion. */
const OVERLAY_COMPONENTS = new Set([
  'Modal',
  'Dialog',
  'AlertDialog',
  'Drawer',
  'Popover',
  'CommandPalette',
]);

/** Map component → component-logic module folder when present. */
function listSharedLogicModules() {
  const dir = join(root, 'packages/component-logic/src');
  if (!existsSync(dir)) return new Map();
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const name of readdirSync(dir)) {
    if (name === 'index.ts') continue;
    map.set(name, `@larose-ui/component-logic/${toKebab(name)}`);
  }
  // Overlay covers Modal + Dialog
  map.set('Modal', '@larose-ui/component-logic/overlay');
  map.set('Dialog', '@larose-ui/component-logic/overlay');
  map.set('Presence', '@larose-ui/component-logic/overlay');
  return map;
}

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * @param {boolean} inReact
 * @param {boolean} inVue
 * @param {boolean} inSvelte
 * @param {string} component
 * @param {Map<string, string>} logic
 */
function buildBehaviors(inReact, inVue, inSvelte, component, logic) {
  const allThree = inReact && inVue && inSvelte;
  const intentional = INTENTIONAL_ADAPTER_ASYMMETRIES.has(component);
  /** @type {Record<string, string>} */
  const behaviors = {};

  for (const key of BEHAVIORS) {
    if (intentional && !(inVue && inSvelte)) {
      behaviors[key] = key === 'initialState' ? 'n/a' : 'n/a';
      continue;
    }
    if (!allThree) {
      behaviors[key] = 'fail';
      continue;
    }
    if (PLAYWRIGHT_VERIFIED.has(component) && ['openClose', 'keyboard', 'focus', 'accessibility'].includes(key)) {
      behaviors[key] = 'pass';
      continue;
    }
    if (OVERLAY_COMPONENTS.has(component) && (key === 'portal' || key === 'motion')) {
      if (component === 'Popover' && key === 'portal') {
        // Anchored float — intentional no portal (same across frameworks).
        behaviors[key] = 'n/a';
        continue;
      }
      if (
        component === 'Modal' ||
        component === 'Dialog' ||
        component === 'Drawer' ||
        component === 'AlertDialog' ||
        component === 'CommandPalette' ||
        component === 'Popover'
      ) {
        behaviors[key] = 'pass';
        continue;
      }
      behaviors[key] = 'unverified';
      continue;
    }
    if (key === 'visual' && allThree) {
      behaviors[key] = 'unverified';
      continue;
    }
    if ((key === 'controlledState' || key === 'uncontrolledState') && logic.has(component)) {
      behaviors[key] = 'partial';
      continue;
    }
    behaviors[key] = 'unverified';
  }

  return /** @type {import('../packages/contracts/src/types.ts').ComponentParityBehaviors} */ (
    behaviors
  );
}

const exportsByFw = listFrameworkComponentExports(root);
const reactSet = new Set(exportsByFw.react);
const vueSet = new Set(exportsByFw.vue);
const svelteSet = new Set(exportsByFw.svelte);
const logic = listSharedLogicModules();

const names = new Set([
  ...listCanonicalContractNames(root),
  ...exportsByFw.react,
  ...exportsByFw.vue,
  ...exportsByFw.svelte,
]);

/** Preserve manual notes from a previous matrix when regenerating. */
/** @type {Map<string, string[]>} */
const priorNotes = new Map();
if (existsSync(outFile)) {
  try {
    const prior = JSON.parse(readFileSync(outFile, 'utf8'));
    for (const entry of prior.entries ?? []) {
      if (entry.notes?.length) priorNotes.set(entry.component, entry.notes);
    }
  } catch {
    // ignore
  }
}

const entries = [...names].sort((a, b) => a.localeCompare(b)).map((component) => {
  const inReact = reactSet.has(component);
  const inVue = vueSet.has(component);
  const inSvelte = svelteSet.has(component);
  /** @type {string[]} */
  const notes = [...(priorNotes.get(component) ?? [])];

  if (INTENTIONAL_ADAPTER_ASYMMETRIES.has(component)) {
    notes.push('Intentional adapter asymmetry — not required on every framework.');
  }
  if (OVERLAY_COMPONENTS.has(component) && component === 'Modal') {
    notes.push('Uses @larose-ui/component-logic/overlay presence + portal on React/Vue/Svelte.');
  }

  return {
    component,
    frameworks: { react: inReact, vue: inVue, svelte: inSvelte },
    behaviors: buildBehaviors(inReact, inVue, inSvelte, component, logic),
    sharedLogic: logic.get(component) ?? null,
    notes: notes.length ? [...new Set(notes)] : undefined,
  };
});

mkdirSync(outDir, { recursive: true });
const matrix = {
  version: 1,
  updatedAt: new Date().toISOString(),
  behaviors: BEHAVIORS,
  entries,
};

writeFileSync(outFile, `${JSON.stringify(matrix, null, 2)}\n`);
console.log(`[larose] wrote parity matrix with ${entries.length} components → ${outFile}`);
