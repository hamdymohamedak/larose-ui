import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { listSharedComponentNames, listFrameworkComponentExports } from './component-catalog.mjs';
import { parseComponentExportsFromIndex } from './parse-index-exports.mjs';

/**
 * Components that look like Parent+Suffix but are intentionally standalone
 * Storybook / product surfaces (not compound anatomy pieces).
 */
export const STANDALONE_PREFIX_EXCEPTIONS = new Set([
  'ActivityShareButton',
  'AlertDialog',
  'AsyncButton',
  'ButtonGroup',
  'CaptionButton',
  'CollaborationButton',
  'CollaborationPopover',
  'DatePicker',
  'DateRangePicker',
  'DateTimePicker',
  'DisclosureButton',
  'DisclosureGroup',
  'DisclosureList',
  'DisclosureTriangle',
  'DocumentLauncher',
  'DocumentToolbar',
  'DragDropList',
  'EditMenu',
  'FileBrowser',
  'FilePreview',
  'FileUpload',
  'FormContinue',
  'HelpButton',
  'HomeScreenQuickActions',
  'ImageButton',
  'ImageView',
  'ImageWell',
  'LiquidGlassButton',
  'LiquidGlassCheckbox',
  'LiquidGlassProgress',
  'LiquidGlassRange',
  'LiquidGlassSwitch',
  'LiquidGlassTabBar',
  'LiquidGlassTopBar',
  'LockupCard',
  'MenuBar',
  'MorePullDownButton',
  'OrnamentButton',
  'OrnamentWindow',
  'OutlineView',
  'PathControl',
  'PopUpButton',
  'PullDownButton',
  'SearchField',
  'SecureField',
  'ShareButton',
  'ShareSheet',
  'ShareToolbar',
  'SquareButton',
  'TabView',
  'TimePicker',
  'TokenField',
  'WheelPicker',
]);

/** Never auto-scaffold these — providers, hosts, or require curated demos. */
export const STORYBOOK_SKIP = new Set([
  'AcceleratorProvider',
  'DragDropProvider',
  'LaRoseProvider',
  'MotionProvider',
  'RuntimeProvider',
  'ThemeCustomizationContext',
  'ToastProvider',
  'FieldShell',
]);

/**
 * Shared roots that need a hand-written Demo / registry entry (required props are not
 * auto-defaultable). Listed here so coverage stays green until a curated story lands.
 * Remove a name when you add a real crossFramework registry entry.
 */
export const STORYBOOK_NEEDS_DEMO = new Set([
  'CalendarGrid',
  'Draggable',
  'DropZone',
  'ImageOverlay',
  'Lockup',
  'MorePullDownButton',
  'OrnamentWindow',
  'SearchScopeBar',
  'SearchTokenChip',
  'WheelColumn',
]);

/**
 * @param {string} name
 */
export function toRegistryId(name) {
  return name.length === 0 ? name : name[0].toLowerCase() + name.slice(1);
}

/**
 * @param {string} name
 */
export function isProviderOrContext(name) {
  return /Provider$|Context$/.test(name);
}

/**
 * @param {string} name
 */
export function isIconComponent(name) {
  return /Icon$/.test(name);
}

/**
 * True when `name` is anatomy under a longer shared parent (AccordionItem → Accordion),
 * unless explicitly marked standalone.
 * @param {string} name
 * @param {string[]} allNames
 */
export function isCompoundPart(name, allNames) {
  if (STANDALONE_PREFIX_EXCEPTIONS.has(name)) return false;
  const parents = allNames
    .filter(
      (parent) =>
        parent !== name &&
        name.startsWith(parent) &&
        name.length > parent.length &&
        /^[A-Z]/.test(name.slice(parent.length)),
    )
    .sort((a, b) => b.length - a.length);
  return parents.length > 0;
}

/**
 * @param {string} name
 * @param {string[]} allNames
 * @returns {'skip' | 'compound' | 'icon' | 'root'}
 */
export function classifyStorybookComponent(name, allNames) {
  if (STORYBOOK_SKIP.has(name) || isProviderOrContext(name)) return 'skip';
  if (isIconComponent(name)) return 'icon';
  if (isCompoundPart(name, allNames)) return 'compound';
  return 'root';
}

/**
 * Parse `export { default as Name } from './path'` entries from a package index.
 * @param {string} indexPath
 * @returns {Array<{ name: string; from: string }>}
 */
export function parseDefaultExportPaths(indexPath) {
  if (!existsSync(indexPath)) return [];
  const source = readFileSync(indexPath, 'utf8');
  /** @type {Array<{ name: string; from: string }>} */
  const entries = [];
  const re =
    /export\s*\{\s*default\s+as\s+([A-Za-z][\w]*)\s*\}\s*from\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    entries.push({ name: match[1], from: match[2] });
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Read manual cross-framework registry coverage from manifest.json when present,
 * otherwise scrape registry sources (same approach as generate-cross-framework-manifest).
 * @param {string} root
 * @returns {{ ids: Set<string>; displayNames: Set<string>; componentNames: Set<string> }}
 */
export function readManualRegistryCoverage(root) {
  const manifestPath = join(root, 'apps/playground/.storybook/crossFramework/manifest.json');
  /** @type {Set<string>} */
  const ids = new Set();
  /** @type {Set<string>} */
  const displayNames = new Set();
  /** @type {Set<string>} */
  const componentNames = new Set();

  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const entry of manifest.entries ?? []) {
      if (entry.id) ids.add(entry.id);
      if (entry.displayName) displayNames.add(entry.displayName);
      if (entry.componentName) componentNames.add(entry.componentName);
    }
    return { ids, displayNames, componentNames };
  }

  return { ids, displayNames, componentNames };
}

/**
 * Display names covered by hand-written registry modules (excludes generated.tsx).
 * @param {string} root
 */
export function readHandWrittenRegistryDisplayNames(root) {
  const registryDir = join(root, 'apps/playground/.storybook/crossFramework/registry');
  /** @type {Set<string>} */
  const names = new Set();
  if (!existsSync(registryDir)) return names;

  for (const file of readdirSync(registryDir)) {
    if (!/\.(tsx|ts)$/.test(file)) continue;
    if (file === 'generated.tsx' || file.endsWith('.generated.ts')) continue;
    const source = readFileSync(join(registryDir, file), 'utf8');
    for (const match of source.matchAll(/displayName:\s*'([^']+)'/g)) {
      names.add(match[1]);
    }
  }

  // demos.tsx lives next to registry folder modules already included; also scrape demos via parent
  const demosPath = join(registryDir, 'demos.tsx');
  if (existsSync(demosPath)) {
    const source = readFileSync(demosPath, 'utf8');
    for (const match of source.matchAll(/displayName:\s*'([^']+)'/g)) {
      names.add(match[1]);
    }
  }

  return names;
}

/**
 * @param {string} root
 * @param {string} componentName
 */
export function readComponentContract(root, componentName) {
  const path = join(root, 'contracts/components', `${componentName}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * Props safe for auto Storybook controls (primitives only).
 * @param {{ name: string; type?: string }[]} props
 */
export function pickSimplePropKeys(props = []) {
  const skip = new Set([
    'className',
    'class',
    'style',
    'children',
    'id',
    'key',
    'ref',
    'dangerouslySetInnerHTML',
  ]);
  return props
    .filter((prop) => {
      if (!prop?.name || skip.has(prop.name)) return false;
      // Skip quoted / aria attribute names that are not valid JS identifiers for propKeys.
      if (!/^[A-Za-z_$][\w$]*$/.test(prop.name)) return false;
      if (prop.name.startsWith('on') && prop.name[2] === prop.name[2]?.toUpperCase()) return false;
      const type = String(prop.type ?? '');
      if (['string', 'boolean', 'number'].includes(type)) return true;
      // small union / alias enums still usable as text controls
      if (/^(Size|Density|ThemeMode|BadgeVariant|LabelImportance|ProgressVariant)$/.test(type)) {
        return true;
      }
      if (/^'[^']+'(?:\s*\|\s*'[^']+')+$/.test(type)) return true;
      return false;
    })
    .map((prop) => prop.name);
}

/**
 * @param {{ name: string; type?: string; required?: boolean }} prop
 */
export function isAutoDefaultableProp(prop) {
  if (!prop?.name) return false;
  if (prop.name === 'children') return true;
  if (!/^[A-Za-z_$][\w$]*$/.test(prop.name)) return false;
  if (prop.name.startsWith('on')) return true; // handlers filled with noops in parity helpers when listed
  const type = String(prop.type ?? '');
  if (['string', 'boolean', 'number'].includes(type)) return true;
  if (/^(Size|Density|ThemeMode|BadgeVariant|LabelImportance|ProgressVariant)$/.test(type)) {
    return true;
  }
  if (/^'[^']+'(?:\s*\|\s*'[^']+')+$/.test(type)) return true;
  return false;
}

/**
 * True when every required contract prop can be stubbed for an auto story.
 * @param {{ props?: Array<{ name: string; type?: string; required?: boolean }> } | null} contract
 */
export function canAutoScaffoldContract(contract) {
  const required = (contract?.props ?? []).filter((prop) => prop.required);
  if (required.length === 0) return true;
  return required.every(isAutoDefaultableProp);
}

/**
 * @param {{ name: string; type?: string; required?: boolean }} prop
 * @param {string} componentName
 */
export function defaultValueForProp(prop, componentName) {
  if (prop.name === 'children') return componentName;
  const type = String(prop.type ?? 'string');
  if (type === 'boolean') return false;
  if (type === 'number') return 0;
  if (type === 'Size') return 'md';
  if (prop.name === 'label' || prop.name === 'title' || prop.name === 'placeholder' || prop.name === 'helpTopic') {
    return componentName;
  }
  if (type === 'string' || type.startsWith("'")) return componentName;
  return undefined;
}

/**
 * Components that typically take a text default slot.
 */
export const SLOT_PARITY_COMPONENTS = new Set([
  'Alert',
  'AsyncButton',
  'Badge',
  'Box',
  'Button',
  'DisclosureTriangle',
  'FormContinue',
  'Label',
  'MnemonicLabel',
  'Ornament',
  'OrnamentButton',
  'Typography',
]);

/**
 * Full Storybook discovery report for shared three-framework surface.
 * @param {string} root
 */
export function buildStorybookCatalog(root) {
  const shared = listSharedComponentNames(root);
  const handWritten = readHandWrittenRegistryDisplayNames(root);
  const exportsByFramework = listFrameworkComponentExports(root);

  /** @type {Array<{
   *   name: string;
   *   id: string;
   *   kind: 'skip' | 'compound' | 'icon' | 'root';
   *   covered: boolean;
   *   autoScaffold: boolean;
   *   needsDemo: boolean;
   * }>} */
  const components = [];

  for (const name of shared) {
    const kind = classifyStorybookComponent(name, shared);
    const covered = handWritten.has(name);
    const contract = kind === 'root' && !covered ? readComponentContract(root, name) : null;
    const autoOk = kind === 'root' && !covered && canAutoScaffoldContract(contract);
    const needsDemo =
      kind === 'root' && !covered && (!autoOk || STORYBOOK_NEEDS_DEMO.has(name));
    const autoScaffold = autoOk && !STORYBOOK_NEEDS_DEMO.has(name);
    components.push({
      name,
      id: toRegistryId(name),
      kind,
      covered,
      autoScaffold,
      needsDemo,
    });
  }

  const autoScaffold = components.filter((c) => c.autoScaffold);
  const uncoveredRoots = components.filter((c) => c.kind === 'root' && !c.covered);
  const needsDemo = components.filter((c) => c.needsDemo);

  return {
    generatedAt: new Date().toISOString(),
    sharedCount: shared.length,
    handWrittenCount: handWritten.size,
    autoScaffoldCount: autoScaffold.length,
    uncoveredRootCount: uncoveredRoots.length,
    needsDemoCount: needsDemo.length,
    exportsByFramework: {
      react: exportsByFramework.react.length,
      vue: exportsByFramework.vue.length,
      svelte: exportsByFramework.svelte.length,
    },
    components,
    autoScaffold,
    uncoveredRoots,
    needsDemo,
  };
}

/**
 * Rewrite package-index relative import to playground cross-framework relative import.
 * @param {'vue' | 'svelte'} framework
 * @param {string} from  e.g. './components/Button/Button.vue'
 */
export function toPlaygroundImport(framework, from) {
  const cleaned = from.replace(/^\.\//, '');
  if (framework === 'vue') {
    return `../../../packages/vue/src/${cleaned}`;
  }
  return `../../../packages/svelte/src/lib/${cleaned}`;
}

export { parseComponentExportsFromIndex, listSharedComponentNames };
