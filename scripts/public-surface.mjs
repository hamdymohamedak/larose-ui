/**
 * Public API surface for @larose-ui/* packages.
 *
 * Golden rule: if a package has no clear end-user and its only consumers are
 * other @larose-ui packages, it is internal — still published for transitive
 * deps, but not part of the product story.
 *
 * Monorepo package graph stays precise; this file only classifies the npm surface.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** @typedef {'ui' | 'runtime' | 'meta' | 'feature' | 'styles' | 'branding' | 'tooling' | 'internal'} PublicLayer */

/**
 * Explicit public products (end-user facing).
 * Everything else under packages/ defaults to internal.
 *
 * @type {Record<string, { layer: Exclude<PublicLayer, 'internal'>; tagline: string; peer?: string; example?: string; features?: string[]; docs?: string }>}
 */
export const PUBLIC_PACKAGES = {
  // UI bindings
  react: {
    layer: 'ui',
    tagline: 'Production-ready React components with built-in UI states.',
    peer: 'react >=18',
    example: `import { Button, Card, Input, Dialog } from '@larose-ui/react';
import '@larose-ui/react/styles.css';

<Card title="Profile">
  <Input label="Email" />
  <Button variant="primary">Save</Button>
</Card>`,
    features: [
      'Form controls, overlays, navigation, data display',
      'Loading, error, empty, and disabled states',
      'Token-driven styling via CSS variables',
      'Styles entry: `@larose-ui/react/styles.css`',
    ],
  },
  vue: {
    layer: 'ui',
    tagline: 'Vue 3 components with the same design system as React and Svelte.',
    peer: 'vue >=3',
    example: `import { Button, Card, Input } from '@larose-ui/vue';
import '@larose-ui/styles/styles.css';`,
    features: [
      'Parity components with React / Svelte',
      'Composables for toast and accelerators',
      'One CSS import: `@larose-ui/styles/styles.css` (tokens included)',
    ],
  },
  svelte: {
    layer: 'ui',
    tagline: 'Svelte 5 components with the same design system as React and Vue.',
    peer: 'svelte >=5',
    example: `import { Button, Card, Input } from '@larose-ui/svelte';
import '@larose-ui/styles/styles.css';`,
    features: [
      'Parity components with React / Vue',
      'Context helpers for runtime and toasts',
      'One CSS import: `@larose-ui/styles/styles.css` (tokens included)',
    ],
  },

  // Single stylesheet product (tokens are bundled at build time)
  styles: {
    layer: 'styles',
    tagline: 'Design tokens + component CSS in one stylesheet.',
    example: `import '@larose-ui/styles/styles.css';`,
    features: [
      'Bundles `--lr-*` tokens and component styles together',
      'One import for Vue / Svelte / meta-framework apps',
      'React apps can use `@larose-ui/react/styles.css` instead',
    ],
  },

  // Runtime
  'runtime-react': {
    layer: 'runtime',
    tagline: 'App runtime for React — theme, i18n, network, offline, session.',
    peer: 'react >=18',
    example: `import { LaRoseProvider, useRuntime } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>`,
    features: [
      '`LaRoseProvider` composes runtime contexts',
      '`useRuntime()`, `useTheme()`, `useNetwork()`, `useOffline()`',
      'Toast subpath: `@larose-ui/runtime-react/toast`',
    ],
  },
  'runtime-vue': {
    layer: 'runtime',
    tagline: 'App runtime for Vue 3 — theme, i18n, network, offline, session.',
    peer: 'vue >=3',
    example: `import { LaRoseProvider } from '@larose-ui/runtime-vue';`,
    features: ['`LaRoseProvider` + provide/inject runtime context', 'Network / offline / toast helpers'],
  },
  'runtime-svelte': {
    layer: 'runtime',
    tagline: 'App runtime for Svelte 5 — theme, i18n, network, offline, session.',
    peer: 'svelte >=5',
    example: `import { LaRoseProvider } from '@larose-ui/runtime-svelte';`,
    features: ['`LaRoseProvider` + context stores', 'Network / offline / toast helpers'],
  },

  // Meta-framework
  next: {
    layer: 'meta',
    tagline: 'Next.js integration — SSR CSS and theme bootstrap without FOUC.',
    peer: 'next >=14, react >=18',
    example: `import { LaRoseRoot } from '@larose-ui/next/client';
import { LAROSE_CSS_IMPORTS } from '@larose-ui/next';`,
    features: ['SSR-safe CSS import list', 'Early theme script', 'Client root helpers'],
  },
  nuxt: {
    layer: 'meta',
    tagline: 'Nuxt module — CSS injection, theme script, and auto-imports.',
    peer: 'nuxt >=3',
    example: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@larose-ui/nuxt'],
})`,
    features: ['Nuxt module with CSS + theme bootstrap', 'Auto-imports from runtime-vue'],
  },
  sveltekit: {
    layer: 'meta',
    tagline: 'SvelteKit helpers for SSR CSS and theme bootstrap.',
    peer: '@sveltejs/kit',
    example: `import { createLaRoseThemeScriptContent, LAROSE_CSS_PATHS } from '@larose-ui/sveltekit';`,
    features: ['Theme script for `app.html`', 'CSS path helpers for layouts'],
  },

  // Feature adapters (framework-facing)
  'data-react': {
    layer: 'feature',
    tagline: 'React data fetching with self-healing errors and undo.',
    peer: 'react >=18',
    example: `import { DataView, useQuery } from '@larose-ui/data-react';`,
    features: ['`useQuery`, `useMutation`, `DataView`', 'Self-healing retries', '`useUndo`'],
  },
  'data-vue': {
    layer: 'feature',
    tagline: 'Vue data fetching with self-healing errors and undo.',
    peer: 'vue >=3',
    example: `import { useQuery, DataView } from '@larose-ui/data-vue';`,
    features: ['Query / mutation composables', 'DataView + UndoToast'],
  },
  'data-svelte': {
    layer: 'feature',
    tagline: 'Svelte data controllers with self-healing errors and undo.',
    peer: 'svelte >=5',
    example: `import { createQuery, DataView } from '@larose-ui/data-svelte';`,
    features: ['Query / mutation controllers', 'DataView + UndoToast'],
  },
  'forms-react': {
    layer: 'feature',
    tagline: 'Schema-driven React forms with conditional fields.',
    peer: 'react >=18',
    example: `import { Form } from '@larose-ui/forms-react';`,
    features: ['Declarative schemas', 'Conditional visibility', 'Observability hooks'],
  },
  'forms-vue': {
    layer: 'feature',
    tagline: 'Schema-driven Vue forms with conditional fields.',
    peer: 'vue >=3',
    example: `import { Form } from '@larose-ui/forms-vue';`,
    features: ['Declarative schemas', 'Conditional visibility'],
  },
  'forms-svelte': {
    layer: 'feature',
    tagline: 'Schema-driven Svelte forms with conditional fields.',
    peer: 'svelte >=5',
    example: `import { Form } from '@larose-ui/forms-svelte';`,
    features: ['Declarative schemas', 'Conditional visibility'],
  },
  'permissions-react': {
    layer: 'feature',
    tagline: 'Authorization-aware React UI (RBAC / ABAC).',
    peer: 'react >=18',
    example: `import { Can } from '@larose-ui/permissions-react';`,
    features: ['`<Can>` / `<Permission>`', 'Hidden, disabled, readonly fallbacks'],
  },
  'permissions-vue': {
    layer: 'feature',
    tagline: 'Authorization-aware Vue UI (RBAC / ABAC).',
    peer: 'vue >=3',
    example: `import { Can } from '@larose-ui/permissions-vue';`,
    features: ['`<Can>` + permission composables'],
  },
  'permissions-svelte': {
    layer: 'feature',
    tagline: 'Authorization-aware Svelte UI (RBAC / ABAC).',
    peer: 'svelte >=5',
    example: `import { Can } from '@larose-ui/permissions-svelte';`,
    features: ['`<Can>` + permission store'],
  },
  'observability-react': {
    layer: 'feature',
    tagline: 'UX observability for React — journeys, funnels, rage clicks.',
    peer: 'react >=18',
    example: `import { ObservabilityProvider, useTrackEvent } from '@larose-ui/observability-react';`,
    features: ['Journey tracking', 'Form funnel metrics', 'Sentry / webhook adapters'],
  },
  'observability-vue': {
    layer: 'feature',
    tagline: 'UX observability for Vue — journeys, funnels, rage clicks.',
    peer: 'vue >=3',
    example: `import { ObservabilityProvider } from '@larose-ui/observability-vue';`,
    features: ['Journey tracking', 'Observed form helpers'],
  },
  'observability-svelte': {
    layer: 'feature',
    tagline: 'UX observability for Svelte — journeys, funnels, rage clicks.',
    peer: 'svelte >=5',
    example: `import { ObservabilityProvider } from '@larose-ui/observability-svelte';`,
    features: ['Journey tracking', 'Context getters'],
  },
  'enterprise-react': {
    layer: 'feature',
    tagline: 'Enterprise React patterns — audit, session guard, schema IaC.',
    peer: 'react >=18',
    example: `import { SessionGuard, AuditedInput } from '@larose-ui/enterprise-react';`,
    features: ['Audit trails', 'Session expiry', 'UI schema renderer'],
  },
  'enterprise-vue': {
    layer: 'feature',
    tagline: 'Enterprise Vue patterns — audit, session guard, schema IaC.',
    peer: 'vue >=3',
    example: `import { SessionGuard, AuditedInput } from '@larose-ui/enterprise-vue';`,
    features: ['Audit trails', 'Session guard', 'Schema renderer'],
  },
  'enterprise-svelte': {
    layer: 'feature',
    tagline: 'Enterprise Svelte patterns — audit, session guard, schema IaC.',
    peer: 'svelte >=5',
    example: `import { SessionGuard, AuditedInput } from '@larose-ui/enterprise-svelte';`,
    features: ['Audit trails', 'Session guard', 'Schema renderer'],
  },
  'ai-react': {
    layer: 'feature',
    tagline: 'Permission-bound AI UI for React (SmartTable / SmartForm).',
    peer: 'react >=18',
    example: `import { AIProvider, SmartTable } from '@larose-ui/ai-react';`,
    features: ['NL table filtering', 'NL form fill', 'Permission-gated actions'],
  },
  'ai-vue': {
    layer: 'feature',
    tagline: 'Permission-bound AI UI for Vue (SmartTable / SmartForm).',
    peer: 'vue >=3',
    example: `import { AIProvider, SmartTable } from '@larose-ui/ai-vue';`,
    features: ['SmartTable / SmartForm', 'Permission-gated actions'],
  },
  'ai-svelte': {
    layer: 'feature',
    tagline: 'Permission-bound AI UI for Svelte (SmartTable / SmartForm).',
    peer: 'svelte >=5',
    example: `import { AIProvider, SmartTable } from '@larose-ui/ai-svelte';`,
    features: ['SmartTable / SmartForm', 'Permission-gated actions'],
  },
  'devtools-react': {
    layer: 'feature',
    tagline: 'In-app runtime inspector for React (development only).',
    peer: 'react >=18',
    example: `import { DevToolsProvider } from '@larose-ui/devtools-react';`,
    features: ['Runtime context panel', 'Event timeline', 'Component inspector'],
  },
  'devtools-vue': {
    layer: 'feature',
    tagline: 'In-app runtime inspector for Vue (development only).',
    peer: 'vue >=3',
    example: `import { DevToolsPanel } from '@larose-ui/devtools-vue';`,
    features: ['DevTools panel', 'Runtime / observability bridge'],
  },
  'devtools-svelte': {
    layer: 'feature',
    tagline: 'In-app runtime inspector for Svelte (development only).',
    peer: 'svelte >=5',
    example: `import { DevToolsPanel } from '@larose-ui/devtools-svelte';`,
    features: ['DevTools panel', 'Runtime / observability bridge'],
  },
  'testing-react': {
    layer: 'feature',
    tagline: 'React test utilities with full laRose runtime context.',
    peer: 'react >=18',
    example: `import { renderWithLaRose } from '@larose-ui/testing-react';`,
    features: ['`renderWithLaRose()`', 'Shared test matrix scenarios'],
  },
  'testing-vue': {
    layer: 'feature',
    tagline: 'Vue test helpers aligned with the laRose matrix.',
    peer: 'vue >=3',
    example: `import { resolveVueMatrixOptions } from '@larose-ui/testing-vue';`,
    features: ['Shared test matrix', 'Vue matrix helpers'],
  },
  'testing-svelte': {
    layer: 'feature',
    tagline: 'Svelte test helpers aligned with the laRose matrix.',
    peer: 'svelte >=5',
    example: `import { defaultTestMatrix } from '@larose-ui/testing-svelte';`,
    features: ['Shared test matrix', 'Svelte helpers'],
  },

  // Branding (clear end-user: tenant theming)
  themes: {
    layer: 'branding',
    tagline: 'Named theme presets and tenant branding helpers.',
    example: `import { applyThemePreset, listThemePresets } from '@larose-ui/themes';

applyThemePreset(document.documentElement, 'ocean');`,
    features: [
      'Presets: default, ocean, forest, sunset, refined',
      'Runtime theme application',
      'Tenant branding helpers',
    ],
  },

  // Tooling
  cli: {
    layer: 'tooling',
    tagline: 'CLI for quality gates, migration, and code generation.',
    example: `larose doctor --ci
larose migrate --to 1.0.0 --apply
larose generate feature EmployeeList ./EmployeeList.tsx`,
    features: [
      '`larose doctor` — a11y, contracts, quality scores',
      '`larose migrate` — deprecation scan and codemods',
      '`larose generate` / `contribute` / `release`',
    ],
  },
};

/** Short blurbs for known internal packages (optional polish). */
export const INTERNAL_TAGLINES = {
  core: 'Framework-agnostic types, state machines, and shared contracts.',
  tokens: 'Design-token engine and CSS variables — bundled into @larose-ui/styles; use directly only for advanced JS theming.',
  primitives: 'Headless interaction primitives (focus, tabs, menus, drag-drop).',
  'component-logic': 'Framework-agnostic component domain helpers (HIG-style rules).',
  'liquid-glass-core': 'Liquid Glass optics / displacement engine.',
  'runtime-core': 'Framework-agnostic runtime store (theme, i18n, tenant, events).',
  network: 'Network condition monitor consumed by runtime packages.',
  offline: 'Offline request queue consumed by runtime packages.',
  'data-core': 'Framework-agnostic data client, query/mutation reducers.',
  'forms-core': 'Framework-agnostic form schema validation.',
  'permissions-core': 'Framework-agnostic RBAC/ABAC evaluation.',
  'observability-core': 'Framework-agnostic UX event model and adapters.',
  'ai-core': 'Framework-agnostic AI intent runtime and adapters.',
  'enterprise-core': 'Framework-agnostic audit store and UI schema helpers.',
  'devtools-core': 'Framework-agnostic component performance helpers.',
  'testing-core': 'Shared test matrix definitions.',
  contracts: 'Component/API contract validation used by `larose doctor`.',
  accessibility: 'Static a11y source scanner used by `larose doctor`.',
  migration: 'Codemods, scaffolds, and release intelligence for the CLI.',
  'quality-core': 'Quality scores, browser matrix, and config resolution for the CLI.',
};

export const LAYER_ORDER = ['ui', 'runtime', 'meta', 'feature', 'styles', 'branding', 'tooling', 'internal'];

export const LAYER_LABELS = {
  ui: 'UI',
  runtime: 'Runtime',
  meta: 'Meta-framework',
  feature: 'Features',
  styles: 'Stylesheets',
  branding: 'Branding',
  tooling: 'Tooling',
  internal: 'Internal (advanced)',
};

/**
 * @param {string} dirName package directory name under packages/
 */
export function isPublicPackage(dirName) {
  return Object.prototype.hasOwnProperty.call(PUBLIC_PACKAGES, dirName);
}

/**
 * @param {string} dirName
 * @returns {{ publicApi: boolean; layer: PublicLayer; tagline: string; peer?: string; example?: string; features?: string[]; docs?: string }}
 */
export function getPackageSurface(dirName) {
  if (isPublicPackage(dirName)) {
    const meta = PUBLIC_PACKAGES[dirName];
    return { publicApi: true, ...meta };
  }
  return {
    publicApi: false,
    layer: 'internal',
    tagline: INTERNAL_TAGLINES[dirName] ?? 'Internal building block for other @larose-ui packages.',
  };
}

/**
 * @param {string} [packagesDir]
 */
export function listPackageDirs(packagesDir = join(process.cwd(), 'packages')) {
  return readdirSync(packagesDir).filter((name) => {
    try {
      const pkg = JSON.parse(readFileSync(join(packagesDir, name, 'package.json'), 'utf-8'));
      return typeof pkg.name === 'string' && pkg.name.startsWith('@larose-ui/') && !pkg.private;
    } catch {
      return false;
    }
  });
}

/**
 * Prefer framework styles.css over direct tokens imports in getting-started docs.
 */
export function recommendedStartPackages(framework = 'react') {
  const ui = framework;
  const runtime = `runtime-${framework}`;
  if (framework === 'react') {
    return {
      install: [`@larose-ui/${runtime}`, `@larose-ui/${ui}`],
      stylesImport: `@larose-ui/${ui}/styles.css`,
      optional: [
        `@larose-ui/data-${framework}`,
        `@larose-ui/forms-${framework}`,
        `@larose-ui/permissions-${framework}`,
      ],
    };
  }
  return {
    install: [`@larose-ui/${runtime}`, `@larose-ui/${ui}`, '@larose-ui/styles'],
    stylesImport: '@larose-ui/styles/styles.css',
    optional: [
      `@larose-ui/data-${framework}`,
      `@larose-ui/forms-${framework}`,
      `@larose-ui/permissions-${framework}`,
    ],
  };
}
