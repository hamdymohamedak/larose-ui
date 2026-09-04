#!/usr/bin/env node
/**
 * Generate professional README.md files and npm metadata for all publishable packages.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'https://github.com/hamdymohamedak/larose-ui';
const REPO_GIT = 'git+https://github.com/hamdymohamedak/larose-ui.git';

/** @type {Record<string, { tagline: string; peer?: string; example: string; features: string[]; docs?: string }>} */
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
      'Feature flag evaluators',
    ],
    docs: `${REPO}/blob/main/docs/runtime/RUNTIME_2.md`,
  },
  tokens: {
    tagline: 'Runtime design tokens as CSS custom properties.',
    example: `import '@larose-ui/tokens/styles.css';
import { getTokens, tokensToCSSVariables } from '@larose-ui/tokens';

const vars = tokensToCSSVariables(getTokens('light'));`,
    features: [
      'Light and dark color palettes',
      'Density scaling (compact / comfortable / spacious)',
      'Runtime CSS variables (`--lr-color-*`, `--lr-space-*`)',
      'Tenant brand color overrides',
    ],
  },
  themes: {
    tagline: 'Named theme presets and tenant branding helpers.',
    example: `import { applyThemePreset, listThemePresets } from '@larose-ui/themes';

applyThemePreset(document.documentElement, 'ocean');`,
    features: [
      'Built-in presets: default, ocean, forest, sunset',
      'Runtime theme application without rebuild',
      'Tenant branding integration',
    ],
  },
  react: {
    tagline: 'Production-ready React components with built-in UI states.',
    peer: 'react >=18',
    example: `import { Button, Card, Input, Dialog } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

<Card title="Profile">
  <Input label="Email" />
  <Button variant="primary">Save</Button>
</Card>`,
    features: [
      'Form controls, overlays, navigation, data display',
      'Loading, error, empty, and disabled states',
      'Token-driven styling via CSS variables',
      'AsyncButton, DataTable, CommandPalette, and more',
    ],
  },
  network: {
    tagline: 'Network condition detection for adaptive UI.',
    example: `import { createNetworkMonitor, shouldUseSkeleton } from '@larose-ui/network';

const monitor = createNetworkMonitor();
monitor.subscribe((state) => console.log(state.condition));`,
    features: [
      'Online, offline, slow, and high-latency detection',
      'Navigator connection API integration',
      'Skeleton vs spinner recommendations',
    ],
  },
  offline: {
    tagline: 'Offline request queue with sync and conflict handling.',
    example: `import { createOfflineQueue } from '@larose-ui/offline';

const queue = createOfflineQueue({ persist: true });
await queue.enqueue({ url: '/api/items', method: 'POST', body: { name: 'Draft' } });`,
    features: [
      'Persistent queue (localStorage)',
      'Automatic sync when back online',
      'Retry and conflict detection',
    ],
  },
  runtime: {
    tagline: 'Unified runtime — theme, i18n, permissions, network, and session.',
    peer: 'react >=18',
    example: `import { LaRoseProvider, useRuntime, Feature } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>`,
    features: [
      '`LaRoseProvider` composes all runtime contexts',
      '`useRuntime()`, `useSession()`, `useTheme()`, `useNetwork()`',
      'Feature flags, tenant resolver, AdaptiveTable',
      'Toast subpath: `@larose-ui/runtime-react/toast`',
    ],
    docs: `${REPO}/blob/main/docs/runtime/RUNTIME_2.md`,
  },
  permissions: {
    tagline: 'Authorization-aware UI with RBAC/ABAC patterns.',
    peer: 'react >=18',
    example: `import { Can } from '@larose-ui/permissions-react';

<Can permission="employees.delete" fallback="disabled">
  <DeleteButton />
</Can>`,
    features: [
      '`<Can>` and `<Permission>` components',
      'Hidden, disabled, forbidden, and readonly fallbacks',
      '`<Explainable>` — show why an action is blocked',
    ],
  },
  data: {
    tagline: 'Backend-aware data fetching with self-healing errors.',
    peer: 'react >=18',
    example: `import { DataView } from '@larose-ui/data-react';

<DataView url="/api/employees" permission="employees.read">
  {(rows) => <EmployeeTable data={rows} />}
</DataView>`,
    features: [
      '`useQuery`, `useMutation`, `DataView`',
      'Self-healing errors with auto-retry on 429/5xx',
      '`useUndo` for destructive action recovery',
    ],
  },
  forms: {
    tagline: 'Schema-driven forms with validation and conditional fields.',
    peer: 'react >=18',
    example: `import { Form } from '@larose-ui/forms-react';

<Form
  schema={{ id: 'user', fields: [{ name: 'email', type: 'text', label: 'Email', required: true }] }}
  onSubmit={async (values) => saveUser(values)}
/>`,
    features: [
      'Declarative field schemas',
      'Conditional visibility (`showWhen`)',
      'Observability integration for funnel metrics',
    ],
  },
  observability: {
    tagline: 'UX observability — journeys, funnels, and rage-click analysis.',
    peer: 'react >=18',
    example: `import { useJourneyPage, ObservedForm } from '@larose-ui/observability-react';

function Page() {
  useJourneyPage('employees');
  return <ObservedForm name="create-employee">{/* fields */}</ObservedForm>;
}`,
    features: [
      'User journey tracking and correlation',
      'Form funnel metrics and drop-off signals',
      'Rage click root-cause linking',
      'Sentry, webhook, and console adapters',
    ],
    docs: `${REPO}/blob/main/docs/observability/OBSERVABILITY_2.md`,
  },
  contracts: {
    tagline: 'Validate UI schemas against API contracts in CI.',
    example: `import { validateContract } from '@larose-ui/contracts';

const result = validateContract(uiSchema, apiSchema);
if (!result.valid) console.error(result.mismatches);`,
    features: [
      'Field presence and type mismatch detection',
      'Used by `larose doctor` in CI',
      'Prevents UI/API drift before release',
    ],
  },
  migration: {
    tagline: 'Codemods, generators, and release intelligence.',
    example: `import { applyCodemods, runGenerator } from '@larose-ui/migration';

const code = runGenerator('feature', 'EmployeeList');`,
    features: [
      'Safe codemods (tokens, provider imports, toast path)',
      'Scaffolds for forms, pages, and features',
      'Monorepo release readiness reports',
    ],
    docs: `${REPO}/blob/main/docs/ecosystem/MIGRATION.md`,
  },
  testing: {
    tagline: 'Test utilities with full laRose runtime context.',
    peer: 'react >=18',
    example: `import { renderWithLaRose } from '@larose-ui/testing-react';

renderWithLaRose(<EmployeeTable />, {
  permissions: ['employees.read'],
  theme: 'dark',
});`,
    features: [
      '`renderWithLaRose()` wraps components in `LaRoseProvider`',
      'Default test matrix scenarios (RTL, unauthorized, mobile)',
    ],
  },
  cli: {
    tagline: 'CLI for quality gates, migration, and code generation.',
    example: `# After global install or npx:
larose doctor --ci
larose migrate --to 1.0.0 --apply
larose generate feature EmployeeList ./EmployeeList.tsx`,
    features: [
      '`larose doctor` — a11y, contracts, quality scores',
      '`larose migrate` — deprecation scan and codemods',
      '`larose generate` — form, page, and feature scaffolds',
      '`larose release` — monorepo release intelligence',
    ],
    docs: `${REPO}/blob/main/docs/quality/QUALITY_ENGINE.md`,
  },
  devtools: {
    tagline: 'In-app runtime inspector for development.',
    peer: 'react >=18',
    example: `import { DevToolsProvider } from '@larose-ui/devtools-react';

<LaRoseProvider>
  <DevToolsProvider />
  <App />
</LaRoseProvider>`,
    features: [
      'Runtime context panel (session, tenant, permissions)',
      'Event timeline from the runtime bus',
      'Component inspector with React fiber introspection',
      'Journey tab with rage-click analysis',
    ],
    docs: `${REPO}/blob/main/docs/devtools/DEVTOOLS_2.md`,
  },
  enterprise: {
    tagline: 'Enterprise patterns — audit trails, session guards, schema IaC.',
    peer: 'react >=18',
    example: `import { SessionGuard, AuditedInput, AuditProvider } from '@larose-ui/enterprise-react';

<SessionGuard loginUrl="/login">
  <AuditProvider actor="admin@acme.com">
    <AuditedInput field="salary" label="Salary" resourceId="emp-1" />
  </AuditProvider>
</SessionGuard>`,
    features: [
      'Audit trails on sensitive fields',
      'Session expiry handling',
      'Version compatibility checks',
      'UI schema renderer (IaC for forms)',
    ],
  },
  ai: {
    tagline: 'Permission-bound AI for SmartTable and SmartForm.',
    peer: 'react >=18',
    example: `import { SmartTable, AIProvider, createHttpAdapter } from '@larose-ui/ai-react';

<AIProvider adapter={createHttpAdapter({ baseUrl: 'https://api.example.com' })}>
  <SmartTable readPermission="employees.read" data={rows} columns={columns} keyExtractor={(r) => r.id} />
</AIProvider>`,
    features: [
      'Natural-language table filtering',
      'Natural-language form population',
      'Every action gated by permissions',
      'HTTP adapter with mock fallback',
    ],
    docs: `${REPO}/blob/main/docs/ai/AI_RUNTIME.md`,
  },
  accessibility: {
    tagline: 'Accessibility utilities and component source scanners.',
    example: `import { scanComponentSource, formatA11yReport } from '@larose-ui/accessibility';

const result = scanComponentSource(source, 'Button.tsx');
console.log(formatA11yReport(result));`,
    features: [
      'Static a11y heuristics for component source',
      'Integrated with `larose doctor` and `pnpm a11y`',
      'Recommended CSP export for laRose apps',
    ],
  },
};

function renderReadme(name, meta) {
  const pkg = `@larose-ui/${name}`;
  const docsSection = meta.docs
    ? `- [Package docs](${meta.docs})\n`
    : '';

  return `# ${pkg}

> ${meta.tagline}

Part of **[laRose UI](${REPO})** — the UI Operating System for modern SaaS applications.

## Install

\`\`\`bash
npm install ${pkg}
# or
pnpm add ${pkg}
# or
yarn add ${pkg}
\`\`\`

${meta.peer ? `\n**Peer dependency:** \`${meta.peer}\`\n` : ''}

## Quick start

\`\`\`tsx
${meta.example}
\`\`\`

## Features

${meta.features.map((f) => `- ${f}`).join('\n')}

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | \`@larose-ui/core\`, \`@larose-ui/tokens\`, \`@larose-ui/react\` |
| Runtime | \`@larose-ui/runtime\`, \`@larose-ui/network\`, \`@larose-ui/offline\` |
| Intelligence | \`@larose-ui/data\`, \`@larose-ui/forms\`, \`@larose-ui/permissions\` |
| Platform | \`@larose-ui/observability\`, \`@larose-ui/enterprise\`, \`@larose-ui/ai\` |

## Documentation

- [Monorepo README](${REPO}#readme)
${docsSection}- [Architecture](${REPO}/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](${REPO}/blob/main/docs/ROADMAP.md)
- [Report an issue](${REPO}/issues)

## License

MIT © [laRose UI](${REPO})
`;
}

const packagesDir = join(process.cwd(), 'packages');

for (const name of readdirSync(packagesDir)) {
  const meta = PACKAGES[name];
  if (!meta) continue;

  const dir = join(packagesDir, name);
  const pkgPath = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  writeFileSync(join(dir, 'README.md'), renderReadme(name, meta));

  pkg.license = 'MIT';
  pkg.publishConfig = { access: 'public' };
  pkg.repository = {
    type: 'git',
    url: REPO_GIT,
    directory: `packages/${name}`,
  };
  pkg.homepage = `${REPO}/blob/main/packages/${name}#readme`;
  pkg.bugs = { url: `${REPO}/issues` };
  if (!pkg.keywords?.length) {
    pkg.keywords = ['larose-ui', 'larose', 'react', 'ui-platform', 'design-system', 'saas'];
  }
  const files = new Set(pkg.files ?? ['dist']);
  files.add('README.md');
  pkg.files = [...files];

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`✓ packages/${name} — README.md + metadata`);
}

console.log('\nDone. Run pnpm changeset and publish to update npm package pages.');
