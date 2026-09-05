import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractComponentApi } from './lib/extract-component-api.mjs';
import { parseComponentExportsFromIndex } from './lib/parse-index-exports.mjs';
import { isGlassDocComponent } from './lib/glass-components.mjs';
import { PLAYGROUND_CONTROLS, COMPONENT_ANATOMY } from './lib/docs-metadata.mjs';
import { buildStoryExamplesIndex } from './lib/parse-story-examples.mjs';
import {
  detectFrameworkComponentExports,
  frameworksForComponent,
} from './lib/detect-framework-exports.mjs';
import { buildPlaygroundSeeds } from './lib/generate-playground-seeds.mjs';
import { mergeComponentApi } from './lib/merge-component-api.mjs';
import { buildSearchIndex, extractTokenSearchEntries } from './lib/build-search-index.mjs';
import {
  buildApiCatalogLinkset,
  buildCloudflareHeaders,
  buildComponentMetadataOpenApi,
  buildAgentAuth,
  buildAgentSkillsIndex,
  buildAiCatalog,
  buildAuthMd,
  collectAgentSkillEntries,
  buildDnsAidZoneExample,
  buildDocumentationOpenApi,
  buildDocsSitemapEntries,
  buildHealthCheck,
  buildJwks,
  buildMcpServerCard,
  buildOAuthAuthorizationServer,
  buildOAuthProtectedResource,
  buildOpenIdConfiguration,
  buildPackagesOpenApi,
  buildPageMarkdownMap,
  buildRobotsTxt,
  buildSitemapXml,
} from './lib/agent-ready.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * @typedef {'foundation' | 'ui' | 'runtime' | 'intelligence' | 'meta' | 'tooling'} PackageLayer
 * @typedef {{
 *   tagline: string;
 *   role: string;
 *   whenToInstall: string;
 *   layer: PackageLayer;
 *   consumerFacing: boolean;
 *   example: string;
 *   features: string[];
 *   peer?: string;
 *   install?: { any?: string; react?: string; vue?: string; svelte?: string };
 *   related?: string[];
 *   transitiveNote?: string;
 * }} PackageMeta
 */

const CSS_BASE = '@larose-ui/tokens @larose-ui/styles';

/** @param {string} pkg @param {string[]} [extra] */
function installAny(pkg, extra = []) {
  const parts = [pkg, ...extra].join(' ');
  return `pnpm add ${parts}`;
}

/**
 * Build core + react/vue/svelte adapter trio for an intelligence/runtime domain.
 * @param {object} opts
 * @param {string} opts.domain
 * @param {PackageLayer} opts.layer
 * @param {string} opts.coreTagline
 * @param {string} opts.adapterTagline
 * @param {string} opts.role
 * @param {string} opts.when
 * @param {string[]} opts.features
 * @param {string} opts.coreExample
 * @param {(fw: 'react'|'vue'|'svelte') => string} opts.adapterExample
 * @param {string[]} [opts.extraRelated]
 * @param {boolean} [opts.devOnly]
 */
function domainFamily(opts) {
  const {
    domain,
    layer,
    coreTagline,
    adapterTagline,
    role,
    when,
    features,
    coreExample,
    adapterExample,
    extraRelated = [],
    devOnly = false,
  } = opts;
  const coreId = `${domain}-core`;
  const adapters = /** @type {const} */ (['react', 'vue', 'svelte']);
  /** @type {Record<string, PackageMeta>} */
  const out = {
    [coreId]: {
      tagline: coreTagline,
      role: `${role} (framework-agnostic core)`,
      whenToInstall: 'Only if you are building a custom adapter or reusing the core without UI. App code should install a framework adapter instead.',
      layer,
      consumerFacing: false,
      example: coreExample,
      features,
      install: { any: installAny(`@larose-ui/${coreId}`) },
      related: adapters.map((fw) => `${domain}-${fw}`).concat(extraRelated),
      transitiveNote: `Comes transitively with @larose-ui/${domain}-react|vue|svelte.`,
    },
  };
  for (const fw of adapters) {
    const id = `${domain}-${fw}`;
    const peer =
      fw === 'react' ? 'react >=18' : fw === 'vue' ? 'vue >=3.5' : 'svelte >=5';
    const pkgName = `@larose-ui/${id}`;
    out[id] = {
      tagline: adapterTagline,
      role: `${role} for ${fw === 'react' ? 'React' : fw === 'vue' ? 'Vue 3' : 'Svelte 5'}${devOnly ? ' (dev)' : ''}`,
      whenToInstall: when,
      layer,
      consumerFacing: true,
      peer,
      example: adapterExample(fw),
      features,
      install: {
        [fw]: installAny(pkgName, fw === 'react' ? [] : []),
        any: installAny(pkgName),
      },
      related: [coreId, ...adapters.filter((a) => a !== fw).map((a) => `${domain}-${a}`), ...extraRelated],
    };
  }
  return out;
}

/** @type {Record<string, PackageMeta>} */
const PACKAGES = {
  // ── Foundation ──
  core: {
    tagline: 'Framework-agnostic types, state machines, and runtime contracts.',
    role: 'Shared TypeScript contracts and state helpers used across the platform.',
    whenToInstall: 'Rarely needed directly — most apps get types via UI or runtime packages.',
    layer: 'foundation',
    consumerFacing: false,
    example: `import { createAsyncStateMachine, classifyHttpError } from '@larose-ui/core';

const machine = createAsyncStateMachine();
machine.send({ type: 'START' });`,
    features: [
      'Shared TypeScript types (`UIState`, `AsyncState`, `Environment`)',
      'Async state machine factory',
      'HTTP error classification',
      'Runtime event bus and session state machine',
    ],
    install: { any: installAny('@larose-ui/core') },
    related: ['tokens', 'runtime-core', 'react'],
    transitiveNote: 'Pulled in by most @larose-ui packages.',
  },
  tokens: {
    tagline: 'Runtime design tokens as CSS custom properties.',
    role: 'Design tokens (color, space, type, motion) exposed as CSS variables.',
    whenToInstall: 'Always — import `@larose-ui/tokens/styles.css` in every app.',
    layer: 'foundation',
    consumerFacing: true,
    example: `import '@larose-ui/tokens/styles.css';
import { getTokens, tokensToCSSVariables } from '@larose-ui/tokens';

const vars = tokensToCSSVariables(getTokens('light'));`,
    features: ['Light and dark palettes', 'Density scaling', 'Runtime CSS variables', 'Tenant brand overrides'],
    install: {
      any: installAny('@larose-ui/tokens'),
      react: installAny('@larose-ui/react', [CSS_BASE]),
      vue: installAny('@larose-ui/vue', [CSS_BASE]),
      svelte: installAny('@larose-ui/svelte', [CSS_BASE]),
    },
    related: ['styles', 'themes', 'react', 'vue', 'svelte'],
  },
  styles: {
    tagline: 'Framework-agnostic component CSS from the design system.',
    role: 'Shared visual styles consumed by React, Vue, and Svelte adapters.',
    whenToInstall: 'Always with UI packages — import after tokens.',
    layer: 'foundation',
    consumerFacing: true,
    example: `import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`,
    features: ['CSS modules consumed by React, Vue, and Svelte', 'Single visual language'],
    install: { any: installAny('@larose-ui/styles', ['@larose-ui/tokens']) },
    related: ['tokens', 'react', 'vue', 'svelte'],
  },
  themes: {
    tagline: 'Named theme presets and tenant branding helpers.',
    role: 'Preset themes and helpers to apply brand overrides at runtime.',
    whenToInstall: 'When you need named presets or multi-tenant branding beyond light/dark.',
    layer: 'foundation',
    consumerFacing: true,
    example: `import { createTheme } from '@larose-ui/themes';

const theme = createTheme({ preset: 'refined', colors: { primary: '#6C5CE7' } });`,
    features: ['Built-in presets', 'Runtime theme application', 'Component token overrides'],
    install: { any: installAny('@larose-ui/themes', ['@larose-ui/tokens']) },
    related: ['tokens', 'runtime-react', 'runtime-vue', 'runtime-svelte'],
  },
  primitives: {
    tagline: 'Headless interactive behavior for menus, focus, tabs, and selection.',
    role: 'Framework-agnostic interaction logic (no visual chrome).',
    whenToInstall: 'Only when building custom headless widgets on laRose primitives.',
    layer: 'foundation',
    consumerFacing: false,
    example: `import { handleMenuKeyboard } from '@larose-ui/primitives';`,
    features: ['Menu keyboard navigation', 'Type-ahead', 'Mnemonic bindings', 'Focus trap helpers'],
    install: { any: installAny('@larose-ui/primitives') },
    related: ['component-logic', 'react', 'vue', 'svelte'],
    transitiveNote: 'Comes with UI packages.',
  },
  'component-logic': {
    tagline: 'Shared framework-agnostic component helpers and domain utils.',
    role: 'Pure helpers shared by React/Vue/Svelte component adapters.',
    whenToInstall: 'Almost never as a direct dependency — used internally by UI packages.',
    layer: 'foundation',
    consumerFacing: false,
    example: `import { /* domain helpers */ } from '@larose-ui/component-logic';`,
    features: ['Shared utils', 'Parity-safe logic for multi-framework adapters'],
    install: { any: installAny('@larose-ui/component-logic') },
    related: ['primitives', 'react', 'vue', 'svelte'],
    transitiveNote: 'Comes with UI packages.',
  },
  'liquid-glass-core': {
    tagline: 'Framework-agnostic Liquid Glass optics engine.',
    role: 'Displacement / refraction math and CSS plumbing for LiquidGlass surfaces.',
    whenToInstall: 'Only for custom glass surfaces outside the UI adapters.',
    layer: 'foundation',
    consumerFacing: false,
    example: `import { /* optics helpers */ } from '@larose-ui/liquid-glass-core';`,
    features: ['SVG displacement refraction', 'Blur fallbacks', 'Shared optics config'],
    install: { any: installAny('@larose-ui/liquid-glass-core') },
    related: ['react', 'vue', 'svelte', 'styles'],
    transitiveNote: 'Pulled in by LiquidGlass components in @larose-ui/react|vue|svelte.',
  },

  // ── Framework UI ──
  react: {
    tagline: 'Production-ready React components with LiquidGlass refraction surfaces.',
    role: 'Primary React UI kit (buttons, forms, overlays, navigation, glass).',
    whenToInstall: 'Building a React app — start here with tokens + styles.',
    layer: 'ui',
    consumerFacing: true,
    peer: 'react >=18',
    example: `import { Button, LiquidGlass, LiquidGlassTabBar } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import '@larose-ui/react/styles.css';`,
    features: [
      'Form controls, overlays, navigation, data display',
      'LiquidGlass TabBar, TopBar, Button, Switch, Range, Checkbox, Progress',
      'SVG displacement refraction on Chromium with blur fallback',
      'Token-driven styling and customization hooks',
    ],
    install: {
      react: installAny('@larose-ui/react', [CSS_BASE]),
      any: installAny('@larose-ui/react', [CSS_BASE]),
    },
    related: ['tokens', 'styles', 'runtime-react', 'liquid-glass-core', 'next'],
  },
  vue: {
    tagline: 'Vue 3 components — thin adapter over shared styles and primitives.',
    role: 'Vue 3 UI kit with Composition API providers and shared CSS.',
    whenToInstall: 'Building a Vue 3 app — pair with tokens + styles.',
    layer: 'ui',
    consumerFacing: true,
    peer: 'vue >=3.5',
    example: `import { LaRoseProvider, Button, Input } from '@larose-ui/vue';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`,
    features: ['Foundation parity set with React', 'Composition API providers', 'Shared CSS modules', 'LiquidGlass family'],
    install: {
      vue: installAny('@larose-ui/vue', [CSS_BASE]),
      any: installAny('@larose-ui/vue', [CSS_BASE]),
    },
    related: ['tokens', 'styles', 'runtime-vue', 'nuxt'],
  },
  svelte: {
    tagline: 'Svelte 5 components with runes and shared laRose styles.',
    role: 'Svelte 5 UI kit with runes-based APIs and shared design system.',
    whenToInstall: 'Building a Svelte 5 app — pair with tokens + styles.',
    layer: 'ui',
    consumerFacing: true,
    peer: 'svelte >=5',
    example: `import { LaRoseProvider, Button } from '@larose-ui/svelte';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';`,
    features: ['Svelte 5 runes', 'Shared design tokens', 'Foundation parity components', 'LiquidGlass family'],
    install: {
      svelte: installAny('@larose-ui/svelte', [CSS_BASE]),
      any: installAny('@larose-ui/svelte', [CSS_BASE]),
    },
    related: ['tokens', 'styles', 'runtime-svelte', 'sveltekit'],
  },

  // ── Runtime services ──
  network: {
    tagline: 'Network condition detection for adaptive UI.',
    role: 'Detect online / offline / slow and recommend loading patterns.',
    whenToInstall: 'Usually via runtime-* — install directly only for custom hosts.',
    layer: 'runtime',
    consumerFacing: false,
    example: `import { createNetworkMonitor } from '@larose-ui/network';

const monitor = createNetworkMonitor();
monitor.subscribe((state) => console.log(state.condition));`,
    features: ['Online, offline, slow detection', 'Skeleton vs spinner recommendations'],
    install: { any: installAny('@larose-ui/network') },
    related: ['offline', 'runtime-core', 'runtime-react', 'runtime-vue', 'runtime-svelte'],
    transitiveNote: 'Included when you install runtime-react|vue|svelte.',
  },
  offline: {
    tagline: 'Offline request queue with sync and conflict handling.',
    role: 'Queue mutations while offline and sync when connectivity returns.',
    whenToInstall: 'Usually via runtime-* — install directly for custom offline hosts.',
    layer: 'runtime',
    consumerFacing: false,
    example: `import { createOfflineQueue } from '@larose-ui/offline';

await queue.enqueue({ url: '/api/items', method: 'POST', body: { name: 'Draft' } });`,
    features: ['Persistent queue', 'Automatic sync when online', 'Retry and conflict detection'],
    install: { any: installAny('@larose-ui/offline') },
    related: ['network', 'runtime-core', 'runtime-react', 'runtime-vue', 'runtime-svelte'],
    transitiveNote: 'Included when you install runtime-react|vue|svelte.',
  },

  ...domainFamily({
    domain: 'runtime',
    layer: 'runtime',
    coreTagline: 'Framework-agnostic runtime store, host detection, and i18n.',
    adapterTagline: 'Full LaRoseProvider — theme, toast, accelerators, network, offline, i18n.',
    role: 'Application runtime provider stack',
    when: 'When you need theme + toast + network/offline + i18n (not just themed components).',
    features: ['LaRoseProvider composes runtime contexts', 'Theme, toast, accelerators', 'Network + offline bridges', 'i18n / locale'],
    coreExample: `import { createRuntimeStore, detectHostEnvironment } from '@larose-ui/runtime-core';`,
    adapterExample: (fw) =>
      fw === 'react'
        ? `import { LaRoseProvider } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" locale="en">
  <App />
</LaRoseProvider>`
        : fw === 'vue'
          ? `import { LaRoseProvider } from '@larose-ui/runtime-vue';

// wrap app root with LaRoseProvider`
          : `import { LaRoseProvider } from '@larose-ui/runtime-svelte';

<LaRoseProvider theme="light">
  <slot />
</LaRoseProvider>`,
    extraRelated: ['network', 'offline', 'react', 'vue', 'svelte'],
  }),

  // ── Intelligence ──
  ...domainFamily({
    domain: 'data',
    layer: 'intelligence',
    coreTagline: 'Framework-agnostic data client helpers for laRose UI.',
    adapterTagline: 'Backend-aware data fetching with self-healing errors.',
    role: 'Data fetching / mutations / undo',
    when: 'When components need query/mutation helpers or DataView against your API.',
    features: ['useQuery / createQuery', 'useMutation', 'DataView', 'useUndo', 'Self-healing errors'],
    coreExample: `import { /* data helpers */ } from '@larose-ui/data-core';`,
    adapterExample: (fw) =>
      `import { DataView } from '@larose-ui/data-${fw}';

<DataView url="/api/employees">{(rows) => <Table data={rows} />}</DataView>`,
    extraRelated: ['forms-react', 'forms-vue', 'forms-svelte'],
  }),
  ...domainFamily({
    domain: 'forms',
    layer: 'intelligence',
    coreTagline: 'Framework-agnostic form schema helpers for laRose UI.',
    adapterTagline: 'Schema-driven forms with validation and conditional fields.',
    role: 'Declarative schema forms',
    when: 'When you want forms defined by schema rather than hand-wired fields.',
    features: ['Declarative schemas', 'Conditional visibility', 'Validation', 'Observability hooks'],
    coreExample: `import { /* schema helpers */ } from '@larose-ui/forms-core';`,
    adapterExample: (fw) =>
      `import { Form } from '@larose-ui/forms-${fw}';

<Form schema={{ id: 'user', fields: [{ name: 'email', type: 'text', label: 'Email' }] }} />`,
  }),
  ...domainFamily({
    domain: 'permissions',
    layer: 'intelligence',
    coreTagline: 'Framework-agnostic permission evaluation for laRose UI.',
    adapterTagline: 'Authorization-aware UI with RBAC/ABAC patterns.',
    role: 'Permission-gated UI',
    when: 'When actions or views must respect roles/permissions.',
    features: ['Can / Permission components', 'Explainable blocked actions', 'RBAC/ABAC helpers'],
    coreExample: `import { /* evaluate permissions */ } from '@larose-ui/permissions-core';`,
    adapterExample: (fw) =>
      `import { Can } from '@larose-ui/permissions-${fw}';

<Can permission="employees.delete"><DeleteButton /></Can>`,
  }),
  ...domainFamily({
    domain: 'observability',
    layer: 'intelligence',
    coreTagline: 'Framework-agnostic UX observability model and collectors.',
    adapterTagline: 'UX observability — journeys, funnels, and rage-click analysis.',
    role: 'Product UX analytics',
    when: 'When you want journey / funnel / rage-click insights wired into the UI.',
    features: ['Journey tracking', 'Form funnel metrics', 'Rage click analysis'],
    coreExample: `import { /* collectors */ } from '@larose-ui/observability-core';`,
    adapterExample: (fw) =>
      `import { useJourneyPage } from '@larose-ui/observability-${fw}';

useJourneyPage('employees');`,
  }),
  ...domainFamily({
    domain: 'ai',
    layer: 'intelligence',
    coreTagline: 'Framework-agnostic AI runtime, intents, and adapters.',
    adapterTagline: 'Permission-bound AI for SmartTable and SmartForm.',
    role: 'AI-assisted UI',
    when: 'When you need NL filtering / SmartTable / SmartForm with permission gates.',
    features: ['Natural-language filtering', 'Permission-gated AI actions', 'SmartTable / SmartForm'],
    coreExample: `import { /* AI runtime */ } from '@larose-ui/ai-core';`,
    adapterExample: (fw) =>
      `import { SmartTable, AIProvider } from '@larose-ui/ai-${fw}';`,
  }),
  ...domainFamily({
    domain: 'enterprise',
    layer: 'intelligence',
    coreTagline: 'Framework-agnostic enterprise helpers (version, UI schema, audit).',
    adapterTagline: 'Enterprise patterns — audit trails, session guards, schema IaC.',
    role: 'Enterprise audit / session / schema UI',
    when: 'When you need audit trails, session expiry, or UI-schema rendering.',
    features: ['Audit trails', 'Session expiry', 'UI schema renderer'],
    coreExample: `import { /* enterprise model */ } from '@larose-ui/enterprise-core';`,
    adapterExample: (fw) =>
      `import { SessionGuard, AuditedInput } from '@larose-ui/enterprise-${fw}';`,
  }),
  ...domainFamily({
    domain: 'devtools',
    layer: 'tooling',
    coreTagline: 'Framework-agnostic DevTools analytics for laRose UI.',
    adapterTagline: 'In-app runtime inspector for development.',
    role: 'In-app DevTools panel',
    when: 'Dev-only — inspect runtime context, events, and component trees.',
    features: ['Runtime context panel', 'Event timeline', 'Component inspector'],
    coreExample: `import { /* analytics */ } from '@larose-ui/devtools-core';`,
    adapterExample: (fw) =>
      `import { DevToolsProvider } from '@larose-ui/devtools-${fw}';`,
    devOnly: true,
  }),
  ...domainFamily({
    domain: 'testing',
    layer: 'tooling',
    coreTagline: 'Framework-agnostic test matrix helpers for laRose UI.',
    adapterTagline: 'Testing utilities with full laRose runtime context.',
    role: 'Test helpers / render wrappers',
    when: 'When writing unit or component tests against laRose providers.',
    features: ['renderWithLaRose / framework wrappers', 'Test matrix scenarios'],
    coreExample: `import { /* matrix helpers */ } from '@larose-ui/testing-core';`,
    adapterExample: (fw) =>
      fw === 'react'
        ? `import { renderWithLaRose } from '@larose-ui/testing-react';

renderWithLaRose(<App />, { permissions: ['app.read'] });`
        : `import { /* test helpers */ } from '@larose-ui/testing-${fw}';`,
  }),

  // ── Meta-frameworks ──
  next: {
    tagline: 'Next.js integration — SSR theme script and LaRoseRoot boundary.',
    role: 'Next.js SSR bootstrap for React + laRose.',
    whenToInstall: 'Using Next.js App Router or Pages with laRose React.',
    layer: 'meta',
    consumerFacing: true,
    peer: 'next >=14, react >=18',
    example: `import { LaRoseRoot, createLaRoseThemeScriptContent } from '@larose-ui/next';`,
    features: ['SSR-safe providers', 'Theme bootstrap script', 'CSS path helpers'],
    install: {
      react: installAny('@larose-ui/next', ['@larose-ui/react', '@larose-ui/runtime-react', CSS_BASE]),
      any: installAny('@larose-ui/next', ['@larose-ui/react', '@larose-ui/runtime-react', CSS_BASE]),
    },
    related: ['react', 'runtime-react', 'tokens', 'styles'],
  },
  nuxt: {
    tagline: 'Nuxt module for CSS injection, theme script, and Vue providers.',
    role: 'Nuxt module wiring for Vue + laRose.',
    whenToInstall: 'Using Nuxt 3+ with @larose-ui/vue.',
    layer: 'meta',
    consumerFacing: true,
    peer: 'nuxt >=3.10',
    example: `export default defineNuxtConfig({ modules: ['@larose-ui/nuxt'] });`,
    features: ['Auto-imports', 'SSR theme script', 'LaRoseApp shell'],
    install: {
      vue: installAny('@larose-ui/nuxt', ['@larose-ui/vue', '@larose-ui/runtime-vue']),
      any: installAny('@larose-ui/nuxt', ['@larose-ui/vue', '@larose-ui/runtime-vue']),
    },
    related: ['vue', 'runtime-vue', 'tokens', 'styles'],
  },
  sveltekit: {
    tagline: 'SvelteKit integration — SSR CSS, theme bootstrap, app root.',
    role: 'SvelteKit helpers for SSR-safe laRose setup.',
    whenToInstall: 'Using SvelteKit with @larose-ui/svelte.',
    layer: 'meta',
    consumerFacing: true,
    peer: 'svelte >=5, @sveltejs/kit',
    example: `import { /* SSR helpers */ } from '@larose-ui/sveltekit';`,
    features: ['SSR CSS injection', 'Theme bootstrap', 'App root helpers'],
    install: {
      svelte: installAny('@larose-ui/sveltekit', ['@larose-ui/svelte', '@larose-ui/runtime-svelte', CSS_BASE]),
      any: installAny('@larose-ui/sveltekit', ['@larose-ui/svelte', '@larose-ui/runtime-svelte', CSS_BASE]),
    },
    related: ['svelte', 'runtime-svelte', 'tokens', 'styles'],
  },

  // ── Tooling ──
  cli: {
    tagline: 'CLI for quality gates, migration, and code generation.',
    role: 'larose doctor / migrate / generate / contribute.',
    whenToInstall: 'Dev tooling — quality gates and scaffolds in CI or local.',
    layer: 'tooling',
    consumerFacing: true,
    example: `pnpm add -D @larose-ui/cli
larose doctor --ci`,
    features: ['larose doctor', 'larose migrate', 'larose generate', 'larose contribute'],
    install: { any: 'pnpm add -D @larose-ui/cli' },
    related: ['migration', 'contracts', 'accessibility', 'quality-core'],
  },
  migration: {
    tagline: 'Codemods, generators, and release intelligence.',
    role: 'Migration helpers and deprecation detection.',
    whenToInstall: 'Upgrading between laRose majors or applying codemods.',
    layer: 'tooling',
    consumerFacing: true,
    example: `larose migrate --to 1.0.0 --apply`,
    features: ['Safe codemods', 'Scaffolds', 'Release reports'],
    install: { any: installAny('@larose-ui/migration') },
    related: ['cli'],
  },
  contracts: {
    tagline: 'Validate UI schemas against API contracts in CI.',
    role: 'Contract validation for forms/UI schemas vs APIs.',
    whenToInstall: 'CI quality — used heavily by larose doctor.',
    layer: 'tooling',
    consumerFacing: true,
    example: `import { validateContract } from '@larose-ui/contracts';

validateContract(uiSchema, apiSchema);`,
    features: ['Field mismatch detection', 'Used by larose doctor'],
    install: { any: installAny('@larose-ui/contracts') },
    related: ['cli', 'quality-core'],
  },
  accessibility: {
    tagline: 'Accessibility utilities and component source scanners.',
    role: 'Static a11y heuristics for components and docs.',
    whenToInstall: 'CI / doctor pipelines — not required at runtime.',
    layer: 'tooling',
    consumerFacing: true,
    example: `import { scanComponentSource } from '@larose-ui/accessibility';`,
    features: ['Static a11y heuristics', 'Integrated with larose doctor'],
    install: { any: installAny('@larose-ui/accessibility') },
    related: ['cli', 'quality-core'],
  },
  'quality-core': {
    tagline: 'Framework-agnostic quality scoring and doctor diagnostics.',
    role: 'Shared diagnostics model for larose doctor.',
    whenToInstall: 'Almost never directly — used by the CLI.',
    layer: 'tooling',
    consumerFacing: false,
    example: `import { /* quality scoring */ } from '@larose-ui/quality-core';`,
    features: ['Quality scoring', 'Doctor diagnostic primitives'],
    install: { any: installAny('@larose-ui/quality-core') },
    related: ['cli', 'contracts', 'accessibility'],
    transitiveNote: 'Used internally by @larose-ui/cli.',
  },
};

// Fix install commands on runtime/intelligence adapters to include sensible peers
for (const [id, meta] of Object.entries(PACKAGES)) {
  if (!meta.install) continue;
  const m = /^(runtime|data|forms|permissions|observability|ai|enterprise|devtools|testing)-(react|vue|svelte)$/.exec(id);
  if (!m) continue;
  const [, domain, fw] = m;
  const ui =
    fw === 'react' ? '@larose-ui/react' : fw === 'vue' ? '@larose-ui/vue' : '@larose-ui/svelte';
  const extras = domain === 'runtime' ? [ui, CSS_BASE] : [ui];
  meta.install = {
    ...meta.install,
    [fw]: installAny(`@larose-ui/${id}`, extras),
    any: installAny(`@larose-ui/${id}`, extras),
  };
}

const GUIDES = [
  { id: 'architecture', title: 'Architecture', file: 'docs/architecture/ARCHITECTURE.md' },
  { id: 'vue', title: 'Vue 3', file: 'docs/ecosystem/VUE.md' },
  { id: 'svelte', title: 'Svelte 5', file: 'docs/ecosystem/SVELTE.md' },
  { id: 'nextjs', title: 'Next.js', file: 'docs/ecosystem/NEXTJS.md' },
  { id: 'nuxt', title: 'Nuxt', file: 'docs/ecosystem/NUXT.md' },
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

const reactIndexPath = join(root, 'packages/react/src/index.ts');
const liquidGlassIndexPath = join(root, 'packages/react/src/LiquidGlass/index.ts');
const skipPattern =
  /^(format|resolve|prepare|build|create|apply|get|use|clamp|warn|truncate|sort|filter|flatten|collect|normalize|merge|tokenize|count|default|MAX_|MIN_|STANDARD_|DEFAULT_|PATH_|LAROSE_|BackChevron|Close|Compose|Share|Sidebar|DocumentMenu|Search|Overflow|buildMinute|buildMonth|buildDay|formatDate|parseISO|toISO|snapMinute|resolveAutomatic|createApp|createFile|createEdit|createFormat|createView|createWindow|createHelp|createDefault|createPhoto|entriesFrom|toolbarActions|quickActionsTo|LaRoseProvider|MotionProvider|ToastProvider|DragDropProvider|Presence|Collapse|Can|Permission|DataView|Form|SmartTable|AIProvider|DevToolsProvider|SessionGuard|AuditedInput|UISchemaRenderer)/;

const reactComponentNames = parseComponentExportsFromIndex(reactIndexPath);
const glassComponentNames = reactComponentNames.filter(isGlassDocComponent);

const categoryMap = {
  Actions: ['Button', 'AsyncButton', 'HelpButton', 'SquareButton', 'ButtonGroup', 'ShareButton', 'CollaborationButton', 'ActivityShareButton'],
  Forms: ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch', 'SecureField', 'FormContinue', 'TokenField', 'FileUpload', 'DatePicker', 'TimePicker', 'DateRangePicker', 'Picker', 'WheelPicker', 'WheelColumn', 'DateTimePicker', 'CalendarGrid'],
  Feedback: ['Alert', 'AlertDialog', 'Progress', 'Spinner', 'Badge', 'Skeleton', 'EmptyState', 'Tooltip', 'ToastProvider'],
  Overlay: ['Modal', 'Dialog', 'Drawer', 'Popover', 'ContextMenu', 'CommandPalette'],
  Layout: ['Card', 'Box', 'Collection', 'ColumnView', 'Lockup', 'SplitView', 'SplitViewPane', 'SplitViewToolbar', 'OrnamentWindow', 'Ornament', 'OrnamentButton'],
  Navigation: ['Sidebar', 'Header', 'Breadcrumb', 'Tabs', 'TabsList', 'TabsTrigger', 'TabsPanel', 'TabView', 'TabViewList', 'TabViewTab', 'TabViewPanel', 'Menu', 'MenuBar', 'MenuBarExtra', 'DockMenu', 'DockBar', 'PopUpButton', 'PullDownButton', 'MorePullDownButton', 'EditMenu', 'PathControl', 'Pagination'],
  Toolbar: ['Toolbar', 'ToolbarItem', 'ToolbarGroup', 'ToolbarTitle', 'ToolbarBackButton', 'ToolbarCloseButton', 'ToolbarSearch', 'ToolbarMoreButton', 'ToolbarDocumentMenu', 'ToolbarProminentButton', 'ToolbarFixedSpace', 'ToolbarSection'],
  Glass: [
    'LiquidGlass',
    'LiquidGlassTabBar',
    'LiquidGlassButton',
    'LiquidGlassTopBar',
    'LiquidGlassSwitch',
    'LiquidGlassProgress',
    'LiquidGlassRange',
    'LiquidGlassCheckbox',
  ],
  Data: ['DataTable', 'List', 'ListSection', 'ListRow', 'Table', 'OutlineView', 'OutlineViewToolbar', 'Chart'],
  Content: ['Typography', 'Label', 'DisclosureTriangle', 'DisclosureButton', 'DisclosureGroup', 'DisclosureList', 'ImageView', 'ImageOverlay', 'ImageWell', 'ImageButton', 'TextView', 'Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
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

const frameworkExports = detectFrameworkComponentExports(root);

const components = reactComponentNames
  .filter((name) => !skipPattern.test(name))
  .filter((name) => !name.endsWith('Icon'))
  .map((name) => ({
    id: slug(name),
    name,
    category: byCategory.get(name) ?? 'Other',
    package: 'react',
    frameworks: frameworksForComponent(name, frameworkExports),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

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
const extractedApi = {
  ...extractComponentApi(root, reactComponentNames.filter((name) => !skipPattern.test(name) && !name.endsWith('Icon'))),
  ...extractComponentApi(root, glassComponentNames, liquidGlassIndexPath),
};

const componentNamesForApi = components.map((component) => component.name);
const api = mergeComponentApi(root, extractedApi, componentNamesForApi);

const frameworksByComponent = Object.fromEntries(
  components.map((component) => [component.name, component.frameworks]),
);
const playgroundSeeds = buildPlaygroundSeeds(root, componentNamesForApi, frameworksByComponent);


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
  role: string;
  whenToInstall: string;
  layer: 'foundation' | 'ui' | 'runtime' | 'intelligence' | 'meta' | 'tooling';
  consumerFacing: boolean;
  example: string;
  features: string[];
  peer?: string;
  install?: { any?: string; react?: string; vue?: string; svelte?: string };
  related?: string[];
  transitiveNote?: string;
}

export interface DocsComponentEntry {
  id: string;
  name: string;
  category: string;
  package?: 'react';
  frameworks: Array<'react' | 'vue' | 'svelte'>;
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
  example?: string;
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
  join(dataDir, 'playgroundSeeds.generated.ts'),
  `// Generated by scripts/generate-docs-catalog.mjs — do not edit manually.

export type DocsFrameworkSeed = 'react' | 'vue' | 'svelte';

export interface PlaygroundSeedEntry {
  react: string;
  vue?: string;
  svelte?: string;
}

export const playgroundSeeds: Record<string, PlaygroundSeedEntry> = ${JSON.stringify(playgroundSeeds, null, 2)};

export function getPlaygroundSeed(name: string): PlaygroundSeedEntry | undefined {
  return playgroundSeeds[name];
}
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

/** GitHub Pages project site: https://hamdymohamedak.github.io/larose-ui/ */
const DEFAULT_BASE_PATH = '/larose-ui/';
const DEFAULT_SITE_URL = 'https://hamdymohamedak.github.io/larose-ui';

const basePath = process.env.VITE_BASE_PATH || DEFAULT_BASE_PATH;
const siteUrl =
  process.env.DOCS_SITE_URL ||
  (basePath === '/'
    ? 'http://localhost:5174'
    : `https://hamdymohamedak.github.io${basePath.replace(/\/$/, '')}`);

const sitemapEntries = buildDocsSitemapEntries({ guides: GUIDES, packages, components });
const agentMarkdownDir = join(publicDir, 'agent', 'markdown');
const wellKnownDir = join(publicDir, '.well-known');
const mcpDir = join(wellKnownDir, 'mcp');
const agentSkillsDir = join(wellKnownDir, 'agent-skills');
const openApiDir = join(wellKnownDir, 'openapi');
mkdirSync(wellKnownDir, { recursive: true });
mkdirSync(mcpDir, { recursive: true });
mkdirSync(agentSkillsDir, { recursive: true });
mkdirSync(openApiDir, { recursive: true });
mkdirSync(agentMarkdownDir, { recursive: true });

writeFileSync(join(publicDir, 'robots.txt'), buildRobotsTxt(siteUrl, basePath));
writeFileSync(join(publicDir, 'sitemap.xml'), buildSitemapXml(siteUrl, basePath, sitemapEntries));
writeFileSync(
  join(wellKnownDir, 'api-catalog'),
  `${JSON.stringify(buildApiCatalogLinkset(siteUrl, basePath), null, 2)}\n`,
);
writeFileSync(
  join(wellKnownDir, 'health'),
  `${JSON.stringify(buildHealthCheck(siteUrl), null, 2)}\n`,
);
writeFileSync(
  join(wellKnownDir, 'openid-configuration'),
  `${JSON.stringify(buildOpenIdConfiguration(siteUrl, basePath), null, 2)}\n`,
);
writeFileSync(
  join(wellKnownDir, 'oauth-authorization-server'),
  `${JSON.stringify(buildOAuthAuthorizationServer(siteUrl, basePath), null, 2)}\n`,
);
writeFileSync(
  join(wellKnownDir, 'oauth-protected-resource'),
  `${JSON.stringify(buildOAuthProtectedResource(siteUrl, basePath), null, 2)}\n`,
);
writeFileSync(join(wellKnownDir, 'jwks.json'), `${JSON.stringify(buildJwks(), null, 2)}\n`);
writeFileSync(join(publicDir, 'auth.md'), buildAuthMd(siteUrl, basePath));
const docsPackageVersion = JSON.parse(
  readFileSync(join(root, 'apps/docs/package.json'), 'utf8'),
).version;
writeFileSync(
  join(mcpDir, 'server-card.json'),
  `${JSON.stringify(buildMcpServerCard(siteUrl, basePath, docsPackageVersion), null, 2)}\n`,
);
const agentSkillEntries = collectAgentSkillEntries(agentSkillsDir);
writeFileSync(
  join(agentSkillsDir, 'index.json'),
  `${JSON.stringify(buildAgentSkillsIndex(siteUrl, basePath, agentSkillEntries), null, 2)}\n`,
);
writeFileSync(
  join(wellKnownDir, 'ai-catalog.json'),
  `${JSON.stringify(buildAiCatalog(siteUrl, basePath), null, 2)}\n`,
);
writeFileSync(
  join(openApiDir, 'component-metadata.yaml'),
  buildComponentMetadataOpenApi(siteUrl, components),
);
writeFileSync(join(openApiDir, 'documentation.yaml'), buildDocumentationOpenApi(siteUrl));
writeFileSync(join(openApiDir, 'packages.yaml'), buildPackagesOpenApi(siteUrl, packages));
writeFileSync(join(publicDir, '_headers'), buildCloudflareHeaders(siteUrl, basePath));
writeFileSync(join(publicDir, 'dns-aid.zone.example'), buildDnsAidZoneExample(siteUrl));

  const pageMarkdown = buildPageMarkdownMap({
    entries: sitemapEntries,
    llmsTxt,
    guideContent,
    guides: GUIDES,
    packages,
    components,
    api,
    gettingStartedMdx: readFileSync(join(root, 'apps/docs/content/getting-started.mdx'), 'utf8'),
  });
for (const [pathname, markdown] of Object.entries(pageMarkdown)) {
  const fileName = pathname === '/' ? 'index' : pathname.replace(/^\//, '').replace(/\//g, '__');
  writeFileSync(join(agentMarkdownDir, `${fileName}.md`), `${markdown.trim()}\n`);
}
writeFileSync(
  join(publicDir, 'agent', 'routes.json'),
  `${JSON.stringify({ pages: Object.keys(pageMarkdown).sort() }, null, 2)}\n`,
);

for (const component of components) {
  const importLine = `import { ${component.name} } from '@larose-ui/react';`;
  const metadata = {
    component: component.name,
    category: component.category,
    package: '@larose-ui/react',
    import: importLine,
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
