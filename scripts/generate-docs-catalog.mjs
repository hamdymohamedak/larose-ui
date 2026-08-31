import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractComponentApi } from './lib/extract-component-api.mjs';
import { PLAYGROUND_CONTROLS, COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';
import { buildStoryExamplesIndex } from './lib/parse-story-examples.mjs';
import { buildSearchIndex, extractTokenSearchEntries } from './lib/build-search-index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @type {Record<string, { tagline: string; peer?: string; example: string; features: string[] }>} */
const PACKAGES = {
  core: {
    tagline: 'Framework-agnostic types, state machines, and runtime contracts.',
    example: `import { createAsyncStateMachine, classifyHttpError } from '@larose-ui/core';

const machine = createAsyncStateMachine();
machine.send({ type: 'START' });`,
    features: [
      'Shared TypeScript types (`UIState`, `AsyncState`, `Environment`)',
      'Async state machine factory',
      'HTTP error classification',
      'Runtime event bus and session state machine',
    ],
  },
  tokens: {
    tagline: 'Runtime design tokens as CSS custom properties.',
    example: `import '@larose-ui/tokens/styles.css';
import { getTokens, tokensToCSSVariables } from '@larose-ui/tokens';

const vars = tokensToCSSVariables(getTokens('light'));`,
    features: ['Light and dark palettes', 'Density scaling', 'Runtime CSS variables', 'Tenant brand overrides'],
  },
  themes: {
    tagline: 'Named theme presets and tenant branding helpers.',
    example: `import { createTheme } from '@larose-ui/themes';

const theme = createTheme({ preset: 'refined', colors: { primary: '#6C5CE7' } });`,
    features: ['Built-in presets', 'Runtime theme application', 'Component token overrides'],
  },
  react: {
    tagline: 'Production-ready React components with built-in UI states.',
    peer: 'react >=18',
    example: `import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import '@larose-ui/react/styles.css';`,
    features: ['Form controls, overlays, navigation, data display', 'Token-driven styling', 'Customization hooks'],
  },
  vue: {
    tagline: 'Vue 3 components — thin adapter over shared styles and runtime-core.',
    peer: 'vue >=3.5',
    example: `import { LaRoseProvider, Button, Input } from '@larose-ui/vue';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`,
    features: ['Foundation parity set with React', 'Composition API providers', 'Shared CSS modules'],
  },
  svelte: {
    tagline: 'Svelte 5 components with runes and shared laRose styles.',
    peer: 'svelte >=5',
    example: `import { LaRoseProvider, Button } from '@larose-ui/svelte';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`,
    features: ['Svelte 5 runes', 'Shared design tokens', 'Foundation parity components'],
  },
  styles: {
    tagline: 'Framework-agnostic component CSS from the design system.',
    example: `import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`,
    features: ['CSS modules consumed by React, Vue, and Svelte', 'Single visual language'],
  },
  'runtime-core': {
    tagline: 'Framework-agnostic runtime store, host detection, and i18n.',
    example: `import { createRuntimeStore, detectHostEnvironment } from '@larose-ui/runtime-core';`,
    features: ['Runtime store', 'Host capabilities', 'Tenant and session bridges'],
  },
  primitives: {
    tagline: 'Headless menu keyboard, type-ahead, and accelerator behavior.',
    example: `import { handleMenuKeyboard } from '@larose-ui/primitives';`,
    features: ['Menu keyboard navigation', 'Type-ahead', 'Mnemonic bindings'],
  },
  next: {
    tagline: 'Next.js integration — SSR theme script and LaRoseRoot boundary.',
    peer: 'next >=14, react >=18',
    example: `import { LaRoseRoot, createLaRoseThemeScriptContent } from '@larose-ui/next';`,
    features: ['SSR-safe providers', 'Theme bootstrap script', 'CSS path helpers'],
  },
  nuxt: {
    tagline: 'Nuxt module for CSS injection, theme script, and Vue providers.',
    peer: 'nuxt >=3.10',
    example: `export default defineNuxtConfig({ modules: ['@larose-ui/nuxt'] });`,
    features: ['Auto-imports', 'SSR theme script', 'LaRoseApp shell'],
  },
  'desktop-core': {
    tagline: 'Desktop host utilities — native menus, accelerators, window chrome.',
    example: `import { registerHost, mapMenuBarToNative } from '@larose-ui/desktop-core';`,
    features: ['Electron/Tauri host registration', 'Native menu mapping'],
  },
  electron: {
    tagline: 'Electron adapter for laRose desktop apps.',
    peer: 'electron >=28, react >=18',
    example: `import { LaRoseElectronRoot } from '@larose-ui/electron/client';`,
    features: ['Host bootstrap', 'Native menu templates'],
  },
  tauri: {
    tagline: 'Tauri adapter for laRose desktop webviews.',
    peer: 'react >=18',
    example: `import { LaRoseTauriRoot } from '@larose-ui/tauri/client';`,
    features: ['Host bootstrap', 'Tauri menu helpers'],
  },
  network: {
    tagline: 'Network condition detection for adaptive UI.',
    example: `import { createNetworkMonitor } from '@larose-ui/network';

const monitor = createNetworkMonitor();
monitor.subscribe((state) => console.log(state.condition));`,
    features: ['Online, offline, slow detection', 'Skeleton vs spinner recommendations'],
  },
  offline: {
    tagline: 'Offline request queue with sync and conflict handling.',
    example: `import { createOfflineQueue } from '@larose-ui/offline';

await queue.enqueue({ url: '/api/items', method: 'POST', body: { name: 'Draft' } });`,
    features: ['Persistent queue', 'Automatic sync when online', 'Retry and conflict detection'],
  },
  runtime: {
    tagline: 'Unified runtime — theme, i18n, permissions, network, and session.',
    peer: 'react >=18',
    example: `import { LaRoseProvider } from '@larose-ui/runtime';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>`,
    features: ['LaRoseProvider composes runtime contexts', 'useRuntime, useSession, useTheme', 'Toast subpath'],
  },
  permissions: {
    tagline: 'Authorization-aware UI with RBAC/ABAC patterns.',
    peer: 'react >=18',
    example: `import { Can } from '@larose-ui/permissions';

<Can permission="employees.delete"><DeleteButton /></Can>`,
    features: ['Can and Permission components', 'Explainable blocked actions'],
  },
  data: {
    tagline: 'Backend-aware data fetching with self-healing errors.',
    peer: 'react >=18',
    example: `import { DataView } from '@larose-ui/data';

<DataView url="/api/employees">{(rows) => <Table data={rows} />}</DataView>`,
    features: ['useQuery, useMutation, DataView', 'Self-healing errors', 'useUndo'],
  },
  forms: {
    tagline: 'Schema-driven forms with validation and conditional fields.',
    peer: 'react >=18',
    example: `import { Form } from '@larose-ui/forms';

<Form schema={{ id: 'user', fields: [{ name: 'email', type: 'text', label: 'Email' }] }} />`,
    features: ['Declarative schemas', 'Conditional visibility', 'Observability integration'],
  },
  observability: {
    tagline: 'UX observability — journeys, funnels, and rage-click analysis.',
    peer: 'react >=18',
    example: `import { useJourneyPage } from '@larose-ui/observability';

useJourneyPage('employees');`,
    features: ['Journey tracking', 'Form funnel metrics', 'Rage click analysis'],
  },
  contracts: {
    tagline: 'Validate UI schemas against API contracts in CI.',
    example: `import { validateContract } from '@larose-ui/contracts';

validateContract(uiSchema, apiSchema);`,
    features: ['Field mismatch detection', 'Used by larose doctor'],
  },
  migration: {
    tagline: 'Codemods, generators, and release intelligence.',
    example: `larose migrate --to 1.0.0 --apply`,
    features: ['Safe codemods', 'Scaffolds', 'Release reports'],
  },
  testing: {
    tagline: 'Test utilities with full laRose runtime context.',
    peer: 'react >=18',
    example: `import { renderWithLaRose } from '@larose-ui/testing';

renderWithLaRose(<App />, { permissions: ['app.read'] });`,
    features: ['renderWithLaRose wrapper', 'Test matrix scenarios'],
  },
  cli: {
    tagline: 'CLI for quality gates, migration, and code generation.',
    example: `larose doctor --ci`,
    features: ['larose doctor', 'larose migrate', 'larose generate'],
  },
  devtools: {
    tagline: 'In-app runtime inspector for development.',
    peer: 'react >=18',
    example: `import { DevToolsProvider } from '@larose-ui/devtools';`,
    features: ['Runtime context panel', 'Event timeline', 'Component inspector'],
  },
  enterprise: {
    tagline: 'Enterprise patterns — audit trails, session guards, schema IaC.',
    peer: 'react >=18',
    example: `import { SessionGuard, AuditedInput } from '@larose-ui/enterprise';`,
    features: ['Audit trails', 'Session expiry', 'UI schema renderer'],
  },
  ai: {
    tagline: 'Permission-bound AI for SmartTable and SmartForm.',
    peer: 'react >=18',
    example: `import { SmartTable, AIProvider } from '@larose-ui/ai';`,
    features: ['Natural-language filtering', 'Permission-gated AI actions'],
  },
  accessibility: {
    tagline: 'Accessibility utilities and component source scanners.',
    example: `import { scanComponentSource } from '@larose-ui/accessibility';`,
    features: ['Static a11y heuristics', 'Integrated with larose doctor'],
  },
};

const GUIDES = [
  { id: 'architecture', title: 'Architecture', file: 'docs/architecture/ARCHITECTURE.md' },
  { id: 'vue', title: 'Vue 3', file: 'docs/ecosystem/VUE.md' },
  { id: 'svelte', title: 'Svelte 5', file: 'docs/ecosystem/SVELTE.md' },
  { id: 'nextjs', title: 'Next.js', file: 'docs/ecosystem/NEXTJS.md' },
  { id: 'nuxt', title: 'Nuxt', file: 'docs/ecosystem/NUXT.md' },
  { id: 'desktop', title: 'Desktop integration', file: 'docs/ecosystem/DESKTOP.md' },
  { id: 'runtime', title: 'Runtime', file: 'docs/runtime/RUNTIME_2.md' },
  { id: 'customization', title: 'Customization', file: 'docs/design/CUSTOMIZATION.md' },
  { id: 'motion', title: 'Motion system', file: 'docs/design/MOTION_SYSTEM.md' },
  { id: 'design-language', title: 'Refined design language', file: 'docs/design/REFINED_DESIGN_LANGUAGE.md' },
  { id: 'observability', title: 'Observability', file: 'docs/observability/OBSERVABILITY_2.md' },
  { id: 'devtools', title: 'DevTools', file: 'docs/devtools/DEVTOOLS_2.md' },
  { id: 'ai', title: 'AI runtime', file: 'docs/ai/AI_RUNTIME.md' },
  { id: 'migration', title: 'Migration & CLI', file: 'docs/ecosystem/MIGRATION.md' },
  { id: 'roadmap', title: 'Roadmap', file: 'docs/ROADMAP.md' },
];

const reactIndex = readFileSync(join(root, 'packages/react/src/index.ts'), 'utf8');
const skipPattern =
  /^(format|resolve|prepare|build|create|apply|get|use|clamp|warn|truncate|sort|filter|flatten|collect|normalize|merge|tokenize|count|default|MAX_|MIN_|STANDARD_|DEFAULT_|PATH_|LAROSE_|BackChevron|Close|Compose|Share|Sidebar|DocumentMenu|Search|Overflow|buildMinute|buildMonth|buildDay|formatDate|parseISO|toISO|snapMinute|resolveAutomatic|createApp|createFile|createEdit|createFormat|createView|createWindow|createHelp|createDefault|createPhoto|entriesFrom|toolbarActions|quickActionsTo)/;

const componentNames = new Set();
for (const line of reactIndex.split('\n')) {
  const single = line.match(/^export \{ ([A-Z][A-Za-z0-9_]*) \} from/);
  if (single) componentNames.add(single[1]);
  const multi = line.match(/^export \{([^}]+)\} from/);
  if (multi && !line.startsWith('export type')) {
    for (const part of multi[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (/^[A-Z]/.test(name) && !name.endsWith('Props') && !name.endsWith('Variant') && !name.endsWith('Config')) {
        componentNames.add(name);
      }
    }
  }
}

const categoryMap = {
  Actions: ['Button', 'AsyncButton', 'HelpButton', 'SquareButton', 'ButtonGroup', 'ShareButton', 'CollaborationButton', 'ActivityShareButton'],
  Forms: ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch', 'SecureField', 'FormContinue', 'TokenField', 'FileUpload', 'DatePicker', 'TimePicker', 'DateRangePicker', 'Picker', 'WheelPicker', 'WheelColumn', 'DateTimePicker', 'CalendarGrid'],
  Feedback: ['Alert', 'AlertDialog', 'Progress', 'Spinner', 'Badge', 'Skeleton', 'EmptyState', 'Tooltip', 'ToastProvider'],
  Overlay: ['Modal', 'Dialog', 'Drawer', 'Popover', 'ContextMenu', 'CommandPalette'],
  Layout: ['Card', 'Box', 'Collection', 'ColumnView', 'Lockup', 'SplitView', 'SplitViewPane', 'SplitViewToolbar', 'OrnamentWindow', 'Ornament', 'OrnamentButton'],
  Navigation: ['Sidebar', 'Header', 'Breadcrumb', 'Tabs', 'TabsList', 'TabsTrigger', 'TabsPanel', 'TabView', 'TabViewList', 'TabViewTab', 'TabViewPanel', 'TabBar', 'TabBarList', 'TabBarItem', 'TabBarPanel', 'Menu', 'MenuBar', 'MenuBarExtra', 'DockMenu', 'DockBar', 'PopUpButton', 'PullDownButton', 'MorePullDownButton', 'EditMenu', 'PathControl', 'Pagination'],
  Toolbar: ['Toolbar', 'ToolbarItem', 'ToolbarGroup', 'ToolbarTitle', 'ToolbarBackButton', 'ToolbarCloseButton', 'ToolbarSearch', 'ToolbarMoreButton', 'ToolbarDocumentMenu', 'ToolbarProminentButton', 'ToolbarFixedSpace', 'ToolbarSection'],
  Data: ['DataTable', 'List', 'ListSection', 'ListRow', 'Table', 'OutlineView', 'OutlineViewToolbar', 'Chart'],
  Content: ['Typography', 'Label', 'DisclosureTriangle', 'DisclosureButton', 'DisclosureGroup', 'DisclosureList', 'ImageView', 'ImageOverlay', 'ImageWell', 'ImageButton', 'TextView', 'WebView', 'WebViewShell', 'WebViewNavigation', 'Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
  Sharing: ['ShareSheet', 'CollaborationPopover', 'ShareToolbar', 'ActivityView'],
  Search: ['SearchField', 'SearchScopeBar', 'SearchTokenChip'],
  Files: ['DocumentToolbar', 'FileBrowser', 'FilePreview', 'UnsavedIndicator', 'DocumentLauncher'],
  DragDrop: ['Draggable', 'DropZone', 'DragDropList'],
  Platform: ['HomeScreenQuickActions'],
};

const byCategory = new Map();
for (const [category, names] of Object.entries(categoryMap)) {
  for (const name of names) byCategory.set(name, category);
}

function slug(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
}

const components = [...componentNames]
  .filter((name) => !skipPattern.test(name))
  .filter((name) => !name.endsWith('Icon'))
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({
    id: slug(name),
    name,
    category: byCategory.get(name) ?? 'Other',
  }));

const packages = Object.entries(PACKAGES)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([id, meta]) => ({
    id,
    name: `@larose-ui/${id}`,
    ...meta,
  }));

const guideContentEntries = GUIDES.map((guide) => [
  guide.id,
  readFileSync(join(root, guide.file), 'utf8'),
]);
const guideContent = Object.fromEntries(guideContentEntries);

const componentNameList = components.map((component) => component.name);
const api = extractComponentApi(root, componentNameList);

/** @type {Record<string, import('./lib/docs-types.mjs').DocsExampleEntry[]>} */
const examples = buildStoryExamplesIndex(root, componentNameList);
for (const name of Object.keys(PLAYGROUND_CONTROLS)) {
  if (!examples[name]?.length) {
    examples[name] = buildStoryExamplesIndex(root, [name])[name] ?? [];
  }
}

const tokens = await extractTokenSearchEntries(root);
const searchIndex = buildSearchIndex({
  packages,
  components,
  guides: GUIDES,
  guideContent,
  api,
  examples,
  tokens,
});

const changelogEntries = parseChangelogEntries(root);
const llmsTxt = buildLlmsTxt({ packages, components, guides: GUIDES, api, examples });

const dataDir = join(root, 'apps/docs/src/data');
const publicDir = join(root, 'apps/docs/public');
mkdirSync(dataDir, { recursive: true });
mkdirSync(join(publicDir, 'components'), { recursive: true });

writeFileSync(
  join(dataDir, 'guideContent.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.\n\nexport const guideContent: Record<string, string> = ${JSON.stringify(guideContent)};\n`,
);

writeFileSync(
  join(dataDir, 'catalog.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export interface DocsPackageEntry {
  id: string;
  name: string;
  tagline: string;
  example: string;
  features: string[];
  peer?: string;
}

export interface DocsComponentEntry {
  id: string;
  name: string;
  category: string;
}

export interface DocsGuideEntry {
  id: string;
  title: string;
  file: string;
}

export const docsPackages: DocsPackageEntry[] = ${JSON.stringify(packages, null, 2)};

export const docsComponents: DocsComponentEntry[] = ${JSON.stringify(components, null, 2)};

export const docsGuides: DocsGuideEntry[] = ${JSON.stringify(GUIDES, null, 2)};

export const docsComponentCategories = ${JSON.stringify(
    [...new Set(components.map((c) => c.category))].sort(),
    null,
    2,
  )};

export function findPackage(id: string): DocsPackageEntry | undefined {
  return docsPackages.find((entry) => entry.id === id);
}

export function findComponent(id: string): DocsComponentEntry | undefined {
  return docsComponents.find((entry) => entry.id === id);
}

export function findGuide(id: string): DocsGuideEntry | undefined {
  return docsGuides.find((entry) => entry.id === id);
}
`,
);

writeFileSync(
  join(dataDir, 'api.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export interface DocsPropEntry {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  inherited?: boolean;
}

export interface DocsComponentApi {
  props: DocsPropEntry[];
  events: DocsPropEntry[];
  accessibility: string[];
}

export const docsComponentApi: Record<string, DocsComponentApi> = ${JSON.stringify(api, null, 2)};

export function getComponentApi(name: string): DocsComponentApi | undefined {
  return docsComponentApi[name];
}
`,
);

writeFileSync(
  join(dataDir, 'playground.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export type PlaygroundControlType = 'boolean' | 'select' | 'text' | 'number';

export interface PlaygroundControl {
  control: PlaygroundControlType;
  default?: string | number | boolean;
  options?: string[];
  label?: string;
  min?: number;
  max?: number;
}

export const playgroundControls: Record<string, Record<string, PlaygroundControl>> = ${JSON.stringify(
    PLAYGROUND_CONTROLS,
    null,
    2,
  )};

export interface ComponentAnatomy {
  summary: string;
  structure: string[];
  composition: string;
  slots: string[];
  states: string[];
}

export const componentAnatomy: Record<string, ComponentAnatomy> = ${JSON.stringify(
    COMPONENT_ANATOMY,
    null,
    2,
  )};
`,
);

writeFileSync(
  join(dataDir, 'examples.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export interface DocsExampleEntry {
  id: string;
  title: string;
  kind: string;
  props: Record<string, string | number | boolean>;
  code: string;
  composite?: boolean;
  component?: string;
}

export const docsExamples: Record<string, DocsExampleEntry[]> = ${JSON.stringify(examples, null, 2)};

export function getComponentExamples(name: string): DocsExampleEntry[] {
  return docsExamples[name] ?? [];
}
`,
);

writeFileSync(
  join(dataDir, 'searchIndex.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export interface DocsSearchEntry {
  id: string;
  title: string;
  type: 'component' | 'package' | 'guide' | 'prop' | 'example' | 'token' | 'page';
  path: string;
  keywords: string;
  excerpt: string;
}

export const docsSearchIndex = ${JSON.stringify(searchIndex, null, 2)} as unknown as DocsSearchEntry[];

export interface TokenSearchEntry {
  name: string;
  cssVariable: string;
  value: string;
  category: string;
  description?: string;
  relatedComponents?: string[];
}

export const docsTokenGroups: Record<string, TokenSearchEntry[]> = ${JSON.stringify(tokens, null, 2)};
`,
);

writeFileSync(
  join(dataDir, 'changelog.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export interface DocsChangelogEntry {
  package: string;
  version: string;
  heading: string;
  body: string;
}

export const docsChangelog: DocsChangelogEntry[] = ${JSON.stringify(changelogEntries, null, 2)};
`,
);

writeFileSync(join(publicDir, 'llms.txt'), llmsTxt);

for (const component of components) {
  const metadata = {
    component: component.name,
    category: component.category,
    import: `import { ${component.name} } from '@larose-ui/react';`,
    props: api[component.name]?.props.filter((prop) => !prop.inherited) ?? [],
    examples: examples[component.name] ?? [],
    accessibility: api[component.name]?.accessibility ?? [],
    anatomy: COMPONENT_ANATOMY[component.name] ?? null,
    playground: PLAYGROUND_CONTROLS[component.name] ?? null,
  };
  writeFileSync(
    join(publicDir, 'components', `${component.id}.json`),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );
}

console.log(
  `Generated docs: ${packages.length} packages, ${components.length} components, ${GUIDES.length} guides, ${searchIndex.length} search entries`,
);

function parseChangelogEntries(rootDir) {
  /** @type {import('./lib/docs-types.mjs').DocsChangelogEntry[]} */
  const entries = [];
  const packagesDir = join(rootDir, 'packages');
  for (const pkg of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!pkg.isDirectory()) continue;
    const changelogPath = join(packagesDir, pkg.name, 'CHANGELOG.md');
    try {
      const content = readFileSync(changelogPath, 'utf8');
      const sections = content.split(/^## /m).slice(1);
      for (const section of sections.slice(0, 3)) {
        const [headingLine, ...bodyLines] = section.split('\n');
        entries.push({
          package: `@larose-ui/${pkg.name}`,
          version: headingLine.trim(),
          heading: headingLine.trim(),
          body: bodyLines.join('\n').trim().slice(0, 500),
        });
      }
    } catch {
      // no changelog
    }
  }
  return entries.sort((a, b) => b.version.localeCompare(a.version)).slice(0, 40);
}

function buildLlmsTxt({ packages, components, guides, api, examples }) {
  const lines = [
    '# laRose UI Documentation',
    '',
    'Apple-inspired by default. Fully customizable by architecture.',
    '',
    '## Packages',
    ...packages.map((pkg) => `- ${pkg.name}: ${pkg.tagline}`),
    '',
    '## Components',
    ...components.map((component) => {
      const propCount = api[component.name]?.props.filter((prop) => !prop.inherited).length ?? 0;
      return `- ${component.name} (${component.category}) — ${propCount} documented props`;
    }),
    '',
    '## Guides',
    ...guides.map((guide) => `- ${guide.title}: /docs/guides/${guide.id}`),
    '',
    '## Machine-readable metadata',
    '- Component JSON: /components/{slug}.json',
    '',
  ];
  return `${lines.join('\n')}\n`;
}
