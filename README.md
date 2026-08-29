# laRose

**The UI Operating System for Modern SaaS Applications**

laRose is not a traditional component library. It is a full UI platform with runtime intelligence, observability, enterprise patterns, and DevOps built in.

## Table of contents

- [Quick start](#quick-start)
- [Getting started](#getting-started)
- [Packages](#packages)
- [Usage](#usage)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Design system](#design-system)
- [Package structure](#package-structure)
- [Observability](#observability)
- [Security](#security)
- [Testing strategy](#testing-strategy)
- [DevOps strategy](#devops-strategy)
- [Publishing](#publishing)
- [Migration guide](#migration-guide)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Code of conduct](#code-of-conduct)
- [License](#license)

---

## Quick start

```bash
pnpm install
pnpm build
pnpm dev          # Storybook at http://localhost:6006
pnpm demo         # Vite demo app at http://localhost:5173
pnpm test
pnpm run doctor   # quality gates
```

**Architecture & roadmap:** [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) · [`docs/runtime/RUNTIME_2.md`](docs/runtime/RUNTIME_2.md) · [`docs/ROADMAP.md`](docs/ROADMAP.md)

---

## Getting started

laRose is a UI platform — not just components. This guide shows how to compose the layers in a real app.

### Install

```bash
pnpm add @larose-ui/runtime @larose-ui/react @larose-ui/tokens
```

For intelligence, observability, and enterprise features, add packages as needed:

```bash
pnpm add @larose-ui/data @larose-ui/forms @larose-ui/permissions
pnpm add @larose-ui/observability @larose-ui/enterprise @larose-ui/ai
```

### Minimal app

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

export function App() {
  return (
    <LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
      <Card title="Hello laRose">
        <Input label="Name" />
        <Button>Save</Button>
      </Card>
    </LaRoseProvider>
  );
}
```

`LaRoseProvider` includes optional toasts via lazy `@larose-ui/react` when `enableToasts` is true. Import toast APIs from `@larose-ui/runtime/toast` or `@larose-ui/react`:

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { useToast } from '@larose-ui/runtime/toast';

function SaveButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({ title: 'Saved', message: 'Changes stored.', variant: 'success' })
      }
    >
      Save
    </button>
  );
}
```

### Layer composition

| Layer | Package | Key APIs |
|-------|---------|----------|
| Runtime | `@larose-ui/runtime` | `LaRoseProvider`, theme, i18n, network, offline, `useRuntime` |
| Runtime toasts | `@larose-ui/runtime/toast` | `useToast`, `ToastProvider` |
| Components | `@larose-ui/react` | Button, Input, Modal, Dialog, Card, … |
| Permissions | `@larose-ui/permissions` | `<Can>`, `<Permission>`, `<Explainable>` |
| Data | `@larose-ui/data` | `useQuery`, `DataView`, `SelfHealingError`, `useUndo` |
| Forms | `@larose-ui/forms` | `<Form schema={...} />` |
| Observability | `@larose-ui/observability` | `ObservedForm`, funnel metrics, rage click detection |
| Enterprise | `@larose-ui/enterprise` | `AuditedInput`, `VersionProvider`, `SessionGuard` |
| AI | `@larose-ui/ai` | `SmartTable`, `SmartForm`, custom `AIAdapter` |
| DevTools | `@larose-ui/devtools` | `<DevToolsProvider />` (dev only) |

### Employee CRUD pattern

See `apps/playground/stories/EmployeeCRUD.stories.tsx` for the reference implementation:

- `DataView` for list loading/error/empty states
- `Can` for permission-gated actions
- `Form` with conditional fields
- `useUndo` for destructive actions

### Quality gates

```bash
pnpm build
pnpm test
pnpm run doctor      # bundle budgets, deprecations, contracts, a11y
pnpm check-budgets
pnpm a11y            # component source a11y scan
```

### Storybook

```bash
pnpm dev   # http://localhost:6006
```

Explore stories by layer: **Platform/Full Demo**, **Intelligence/**, **Enterprise/**, **AI/**, **Observability/**, **DevOps/**.

---

## Packages

| Package | Description |
|---------|-------------|
| `@larose-ui/core` | Types, async state machines, error classification |
| `@larose-ui/tokens` | Runtime design tokens with density + theming |
| `@larose-ui/themes` | Named theme presets and tenant branding |
| `@larose-ui/react` | React components with production UI states |
| `@larose-ui/network` | Network condition detection (online/offline/slow) |
| `@larose-ui/offline` | Offline request queue with sync + conflict handling |
| `@larose-ui/runtime` | Full provider tree — theme, i18n, network, offline, responsive |
| `@larose-ui/permissions` | Can, Permission, RBAC/ABAC authorization UI |
| `@larose-ui/data` | useQuery, useMutation, DataView, self-healing errors, undo |
| `@larose-ui/forms` | Schema-driven forms with conditional fields |
| `@larose-ui/observability` | Event tracking, funnel metrics, rage click detection |
| `@larose-ui/contracts` | UI/API contract validation |
| `@larose-ui/migration` | Deprecation scanning and migration reports |
| `@larose-ui/testing` | `renderWithLaRose()`, test matrix utilities |
| `@larose-ui/cli` | `larose doctor`, `migrate`, `generate` |
| `@larose-ui/devtools` | In-app runtime inspector (dev only) |
| `@larose-ui/enterprise` | Audit trails, version compatibility, UI schema IaC, security |
| `@larose-ui/ai` | SmartTable, SmartForm, pluggable AI adapters |
| `@larose-ui/accessibility` | Component source a11y scanner |
| `@larose-ui/playground` | Storybook component playground (private) |
| `@larose-ui/demo` | Vite demo app — production-style integration (private) |

---

## Usage

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { DataView } from '@larose-ui/data';
import { Can } from '@larose-ui/permissions';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

function App() {
  return (
    <LaRoseProvider
      theme="light"
      locale="en"
      permissions={['employees.read']}
      tenantId="acme"
      observabilityDebug
    >
      <Can permission="employees.read">
        <Card title="Employees">
          <DataView url="/api/employees">
            {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
          </DataView>
        </Card>
      </Can>
    </LaRoseProvider>
  );
}
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Storybook playground |
| `pnpm demo` | Vite demo app |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | ESLint on packages and apps |
| `pnpm run doctor` | Bundle budgets, deprecations, contracts, a11y |
| `pnpm check-budgets` | Fail on bundle size overages |
| `pnpm a11y` | Scan component sources for a11y issues |
| `pnpm verify:publish` | Pre-publish readiness check |
| `pnpm release:publish` | Build and publish to npm |
| `pnpm changeset` | Create a changeset for release |

---

## Architecture

> The UI Operating System for Modern SaaS Applications

### Vision

laRose is not a traditional component library. It is a **UI platform** with runtime, intelligence, developer experience, DevOps, and observability built in from day one.

```text
UI Platform
    │
    ├── UI Layer          (components, layout, forms, tables)
    ├── Intelligence      (permissions, state machines, API awareness, AI)
    ├── Runtime           (theme, responsive, offline, tenant)
    └── Observability     (analytics, errors, performance)
            │
            └── DevOps    (tests, visual QA, releases, CLI)
```

### Layer model

#### UI layer

Presentational and behavioral components that understand production states:

```text
Loading | Success | Error | Empty | Disabled | Read Only
Unauthorized | Offline | Retry | Optimistic Update | Rollback
```

Components are built on `@larose-ui/core` primitives and styled via `@larose-ui/tokens`.

#### Intelligence layer

Backend-aware abstractions that eliminate repeated boilerplate:

| Primitive | Purpose |
|-----------|---------|
| `<DataView />` | Fetch, paginate, empty/error/retry states |
| `<Form />` | Schema-driven forms with server validation |
| `<Resource />` | CRUD lifecycle for a single entity |
| `<Query />` | Declarative data fetching |
| `<Mutation />` | Declarative mutations with optimistic updates |
| `<Can />` / `<Permission />` | RBAC/ABAC-aware rendering |
| `<AsyncButton />` | State-machine driven actions |
| `<Feature />` | Feature flag gating |
| `<OfflineForm />` | Offline queue + sync |

#### Runtime layer

Environment and context that flows through the component tree:

| Concern | Provider |
|---------|----------|
| Theme / tokens | `LaRoseProvider` |
| Tenant branding | `TenantProvider` |
| Density | `DensityProvider` |
| i18n / RTL | `I18nProvider` |
| Network state | `NetworkProvider` |
| Permissions | `PermissionProvider` |
| Environment | `EnvironmentProvider` |
| Feature flags | `FeatureFlagProvider` |

#### Observability layer

Every major component can opt into telemetry:

```jsx
<ObservedForm name="employee-create" />
```

Tracks: open rate, completion rate, error rate, abandonment, rage clicks, dead buttons, slow renders.

### State management strategy

**Principle:** Use explicit state machines over boolean soup.

```text
idle → loading → success | error → retrying
```

- Local UI state: React `useState` / `useReducer`
- Async lifecycle: `@larose-ui/core` state machine (`createAsyncStateMachine`)
- Server state: `@larose-ui/data` (Query/Mutation abstractions, TanStack Query compatible)
- Global runtime: React Context providers (theme, permissions, network)
- Offline queue: `@larose-ui/offline` persistent queue with IndexedDB

No global Redux store. Context + server-state library keeps boundaries clear.

### API / data layer strategy

```text
Backend Contract → UI Contract → Component
```

- HTTP client with automatic error classification (401, 403, 404, 409, 422, 429, 500)
- Self-healing error messages with retry/backoff
- Contract validation in CI via `@larose-ui/contracts`
- Pagination, empty, and unauthorized states handled by `<DataView />`

### Package dependency graph

```text
@larose-ui/tokens
@larose-ui/core
    ↓
@larose-ui/react ← @larose-ui/accessibility
    ↓
@larose-ui/runtime (theme, responsive, network, offline)
    ↓
@larose-ui/data | @larose-ui/permissions | @larose-ui/forms
    ↓
@larose-ui/observability | @larose-ui/ai
    ↓
@larose-ui/devtools | @larose-ui/cli | @larose-ui/migration
```

Apps depend on `@larose-ui/react` + selected intelligence packages. Tree-shakeable ESM.

### Runtime architecture

```text
App Root
  └── LaRoseProvider (composes all runtime providers)
        ├── ThemeProvider      (tokens, dark mode, density)
        ├── TenantProvider     (multi-tenant branding)
        ├── I18nProvider       (ar, en, de + RTL)
        ├── PermissionProvider (RBAC/ABAC)
        ├── NetworkProvider    (online/offline/slow)
        ├── EnvironmentProvider (dev/staging/prod/demo)
        └── FeatureFlagProvider
              └── App Routes / Pages
                    └── Intelligence primitives (DataView, Form, Can, ...)
                          └── UI components (Button, Table, Dialog, ...)
```

### Technology choices

| Area | Choice | Rationale |
|------|--------|-----------|
| Language | TypeScript strict | Type safety across packages |
| UI | React 19 | Industry standard, concurrent features |
| Bundler | tsup + Vite | Fast library builds, fast playground |
| Monorepo | pnpm + Turborepo | Efficient workspaces, cached builds |
| Styling | CSS Modules + tokens | Runtime theming without rebuild |
| Testing | Vitest + Testing Library | Fast unit/integration |
| A11y CI | axe-core | Automated accessibility gates |
| Visual QA | Storybook + Chromatic-ready | State matrix testing |

### Accessibility architecture

Built into `@larose-ui/accessibility`:

- Focus trap, focus restore, aria-labelledby/describedby for overlays
- Keyboard navigation contracts for all interactive components
- Reduced motion via token system
- Development warnings + CI axe checks via `@larose-ui/cli doctor`

### Theming / token architecture

Runtime CSS custom properties injected by `@larose-ui/tokens`:

```text
Global defaults → Brand → Organization → Tenant → User preference
```

No rebuild required for tenant rebrand. Density (compact/comfortable/spacious) scales spacing and typography consistently.

### Permissions architecture

```jsx
<Can permission="employees.delete" fallback="hidden">
  <DeleteButton />
</Can>
```

Supports: visible, hidden, disabled, read-only, forbidden, permission-loading.

Never use `user.role === "admin"` as the primary pattern. Permissions are resource.action strings evaluated by `@larose-ui/permissions`.

### Offline architecture

```text
User action → Local persist → Queue → Sync when online → Reconcile
```

Conflict resolution with rollback. Optimistic updates with undo.

### AI integration architecture

Pluggable AI adapters behind `@larose-ui/ai`:

- `<SmartTable />` — natural language filtering
- `<SmartForm />` — natural language field population

Components expose stable APIs; AI is an optional intelligence layer, not a breaking dependency.

### DevTools architecture

Browser extension + in-app panel (`@larose-ui/devtools`):

- Component tree, permissions, network, feature flags, theme, tenant, performance, errors

### CLI architecture

```bash
larose doctor    # a11y, deprecated APIs, contracts, permissions
larose migrate   # codemods for version upgrades
larose generate  # scaffold pages/forms from schema
```

### Release / versioning strategy

- Semver per package (`@larose-ui/react@1.2.0`)
- Changesets for changelog + coordinated releases
- LTS branches for enterprise customers
- Migration codemods ship with every major version

### Non-goals (remaining)

- Browser DevTools extension (in-app `@larose-ui/devtools` panel ships instead)
- Rich calendar UI date pickers (foundation `@larose-ui/react` ships token-styled native date/time inputs)
- Hosted observability backend (adapters emit to your stack)
- Public docs site / generated API reference (architecture docs in repo for now)

---

## Design system

### Principles

1. **States are first-class** — every component handles loading, error, empty, disabled, and more
2. **Tokens over hardcoded values** — all visual properties flow from runtime tokens
3. **Density is systemic** — compact/comfortable/spacious affects all components consistently
4. **Accessibility is default** — not an optional addon
5. **Tenant branding at runtime** — no rebuild for rebrand

### Token categories

#### Color

```text
--lr-color-primary
--lr-color-primary-hover
--lr-color-primary-active
--lr-color-secondary
--lr-color-success
--lr-color-warning
--lr-color-error
--lr-color-info
--lr-color-background
--lr-color-surface
--lr-color-surface-elevated
--lr-color-border
--lr-color-text
--lr-color-text-muted
--lr-color-text-inverse
```

Semantic naming — components never reference raw hex values.

#### Typography

```text
--lr-font-family-sans
--lr-font-family-mono
--lr-font-size-xs | sm | md | lg | xl | 2xl
--lr-font-weight-normal | medium | semibold | bold
--lr-line-height-tight | normal | relaxed
```

#### Spacing

```text
--lr-space-1 through --lr-space-12
```

Scaled by density multiplier.

#### Radius

```text
--lr-radius-sm | md | lg | full
```

#### Shadow

```text
--lr-shadow-sm | md | lg
```

#### Motion

```text
--lr-duration-fast | normal | slow
--lr-easing-default | bounce | sharp
```

Respects `prefers-reduced-motion`.

### Density system

| Density | Multiplier | Use Case |
|---------|------------|----------|
| Compact | 0.85 | Admin dashboards |
| Comfortable | 1.0 | Default user UI |
| Spacious | 1.15 | Accessibility preference |

Affects: padding, font size, gap, min touch target (44px minimum enforced at spacious).

### Theme modes

- **Light** — default
- **Dark** — inverted surfaces, adjusted contrast
- **Tenant override** — brand colors applied at runtime

### Component anatomy

Every component follows:

```text
[Root] — layout + data attributes
  [Icon] — optional, decorative or semantic
  [Content] — label/text
  [Indicator] — loading spinner, error icon, etc.
```

#### Data attributes

Components expose state via `data-*` for styling and testing:

```html
<button data-state="loading" data-variant="primary" data-size="md">
```

#### Variants

Standard variant prop pattern:

```text
variant: primary | secondary | outline | ghost | destructive
size: sm | md | lg
```

### UI state matrix

Every major component supports:

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Normal appearance | Interactive |
| Loading | Spinner/skeleton | Disabled interaction |
| Success | Success indicator | Optional auto-reset |
| Error | Error styling + message | Retry available |
| Empty | Placeholder content | CTA to create |
| Disabled | Muted, no pointer | `aria-disabled` |
| Read Only | Display only | No edit affordance |
| Unauthorized | Hidden or forbidden | Explainable message |

### Component catalog

#### `@larose-ui/react` (foundation)

- Button — variants, loading, disabled, error
- Input, Textarea, Select — validation states, read-only, disabled
- DatePicker, TimePicker, DateRangePicker — token-styled native date/time inputs
- Checkbox, Radio, Switch, Progress
- Tooltip, Toast (`ToastProvider`, `useToast`), Tabs
- Drawer, Popover, Breadcrumb
- Accordion, Pagination, DataTable
- FileUpload, Sidebar, Header, CommandPalette (`useCommandPaletteShortcut`)
- Spinner, Alert, Modal, Dialog, Card, Badge, Skeleton, EmptyState, AsyncButton

#### Intelligence layer (separate packages)

- `<Form />` — schema-driven forms (`@larose-ui/forms`; uses `@larose-ui/react` Textarea/Select)
- `<DataView />`, `useQuery`, `useMutation` — `@larose-ui/data`
- `<Can />` — `@larose-ui/permissions`
- `<AdaptiveTable />` — responsive table layouts (`@larose-ui/runtime`)
- `<SmartTable />`, `<SmartForm />` — `@larose-ui/ai`

### Responsive behavior

Components use container-aware layouts where possible. `AdaptiveTable` in `@larose-ui/runtime` switches table → cards → priority layout by breakpoint context.

### Internationalization

- Arabic (RTL), English, German at launch
- All user-facing strings via i18n keys
- RTL flips layout direction at provider level

### Anti-patterns

❌ Hardcoded colors in components  
❌ Boolean props like `isLoading && isError && isDisabled`  
❌ Inline permission checks (`user.role === 'admin'`)  
❌ Components that only handle the happy path  
❌ Rebuilding for tenant theme changes

---

## Package structure

### Monorepo layout

```text
laRose/
├── packages/
│   ├── core/              @larose-ui/core
│   ├── tokens/            @larose-ui/tokens
│   ├── react/             @larose-ui/react
│   ├── runtime/           @larose-ui/runtime
│   ├── network/           @larose-ui/network
│   ├── offline/           @larose-ui/offline
│   ├── data/              @larose-ui/data
│   ├── permissions/       @larose-ui/permissions
│   ├── forms/             @larose-ui/forms
│   ├── observability/     @larose-ui/observability
│   ├── accessibility/     @larose-ui/accessibility
│   ├── testing/           @larose-ui/testing
│   ├── contracts/         @larose-ui/contracts
│   ├── cli/               @larose-ui/cli
│   ├── devtools/          @larose-ui/devtools
│   ├── migration/         @larose-ui/migration
│   ├── ai/                @larose-ui/ai
│   ├── enterprise/        @larose-ui/enterprise
│   └── themes/            @larose-ui/themes
├── apps/
│   ├── playground/        @larose-ui/playground     Storybook
│   └── demo/              @larose-ui/demo           Vite integration demo
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Package responsibilities

#### `@larose-ui/core`

Framework-agnostic foundation:

- Shared TypeScript types (`UIState`, `AsyncState`, `Density`, `Environment`)
- Async state machine factory
- Error classification utilities
- Event emitter for observability hooks

**Dependencies:** none  
**Dependents:** all packages

#### `@larose-ui/tokens`

Runtime design token system:

- Token definitions (color, typography, spacing, radius, shadow, motion)
- CSS custom property generation
- Theme presets (light, dark)
- Density scaling

**Dependencies:** `@larose-ui/core`  
**Dependents:** `@larose-ui/react`, `@larose-ui/runtime`, `@larose-ui/themes`

#### `@larose-ui/react`

React component library:

- All UI components with production state support
- Re-exports token utilities for convenience
- Peer dependency on React 18+

**Dependencies:** `@larose-ui/core`, `@larose-ui/tokens`  
**Dependents:** apps, intelligence packages

#### `@larose-ui/runtime`

Composed provider tree:

- `LaRoseProvider`
- Theme, tenant, i18n, environment providers

**Dependencies:** `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react`  
**Dependents:** apps

#### `@larose-ui/data`

Backend-aware UI:

- `Query`, `Mutation`, `DataView`, `Resource`
- HTTP client with error mapping
- Pagination helpers

**Dependencies:** `@larose-ui/core`, `@larose-ui/react`  
**Dependents:** `@larose-ui/forms`, demo apps

#### `@larose-ui/permissions`

Authorization-aware UI:

- `Can`, `Permission`
- RBAC/ABAC evaluators
- Permission loading states

**Dependencies:** `@larose-ui/core`, `@larose-ui/react`

#### `@larose-ui/forms`

Schema-driven forms:

- `<Form schema={...} />`
- Conditional/dependent fields
- Server validation integration

**Dependencies:** `@larose-ui/core`, `@larose-ui/react`, `@larose-ui/data`

#### `@larose-ui/observability`

UX telemetry:

- `ObservedForm`, interaction tracking
- Performance measurement
- Metric exports

**Dependencies:** `@larose-ui/core`, `@larose-ui/react`

#### `@larose-ui/themes`

Named theme presets and tenant branding helpers:

- Built-in presets (`default`, `ocean`, `forest`, `sunset`)
- `applyThemePreset()` for runtime branding
- Re-exports `createTenantTheme` from `@larose-ui/tokens`

**Dependencies:** `@larose-ui/core`, `@larose-ui/tokens`  
**Dependents:** apps, `@larose-ui/runtime` (optional)

#### `@larose-ui/accessibility`

A11y utilities and validators:

- Component source scanner (`scanComponentSource`)
- Integrated with `larose doctor` and CI (`pnpm a11y`)
- Recommended CSP export

**Dependencies:** `@larose-ui/core`

#### `@larose-ui/cli`

Developer tooling:

- `larose doctor`
- `larose migrate`
- `larose generate`

**Dependencies:** multiple `@larose-ui/*` for validation

#### `@larose-ui/enterprise`

Enterprise patterns:

- `AuditedInput`, audit trail provider
- `VersionProvider`, compatibility checks
- UI schema IaC (`SchemaRenderer`, `compileFormSchema`)
- `SessionGuard`, `SensitiveAction`

**Dependencies:** `@larose-ui/core`, `@larose-ui/forms`, `@larose-ui/permissions`, `@larose-ui/runtime`, `@larose-ui/react`

#### `@larose-ui/ai`

Pluggable AI intelligence layer:

- `SmartTable` — natural language filtering
- `SmartForm` — natural language field population
- `AIAdapter` interface + mock adapter for demos

**Dependencies:** `@larose-ui/forms`, `@larose-ui/runtime`, `@larose-ui/react`

#### `@larose-ui/playground`

Storybook app for component state matrix testing.

**Dependencies:** `@larose-ui/react`, `@larose-ui/tokens`

### Dependency rules

1. **No circular dependencies** — enforced by Turborepo + manual review
2. **Core has zero deps** — keeps primitives portable
3. **React is peer dep** — only in `@larose-ui/react` and above
4. **Intelligence packages don't depend on each other** — compose at app level
5. **DevTools/CLI are leaf packages** — depend on others, nothing depends on them

### Build output

Each package publishes:

```text
dist/
├── index.js      (ESM)
├── index.d.ts    (types)
└── index.css     (if applicable)
```

Format: ESM only. `"type": "module"` throughout.

### Versioning

Independent semver per package, coordinated via Changesets:

```text
@larose-ui/core@0.1.0
@larose-ui/tokens@0.1.0
@larose-ui/react@0.1.0
```

Breaking changes in `@larose-ui/core` trigger major bumps in dependent packages.

---

## Observability

### Goal

> Turn the UI Kit into a UX Observability Platform.

Components should be observable in production without developers wiring analytics manually.

### What we track

#### UI errors

- Uncaught render errors (error boundaries)
- Failed interactions (dead buttons, rage clicks)
- API failures surfaced in UI
- Validation failures

#### Component performance

- Render time per component
- Interaction-to-paint latency
- Slow component warnings (>16ms render)
- Bundle impact per route

#### User actions

- Form opened / field focused / submit clicked
- Navigation events
- Feature flag exposures
- Permission denials (UI-level)

#### Form funnel metrics

| Metric | Description |
|--------|-------------|
| Open Rate | Form views / page views |
| Completion Rate | Successful submits / opens |
| Error Rate | Failed submits / attempts |
| Abandonment Rate | Opens without submit |
| Avg Completion Time | Open to success duration |

### API

```jsx
<ObservedForm name="employee-create">
  {/* form fields */}
</ObservedForm>

<ObservedComponent name="EmployeeTable" />
```

#### Event schema

```typescript
interface UIEvent {
  type: 'form.opened' | 'form.submitted' | 'form.abandoned' | 'interaction' | 'error' | 'performance';
  component: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
  tenant?: string;
  user?: string;
}
```

### Architecture

```text
Component
    ↓
@larose-ui/observability (event collector)
    ↓
Adapter (pluggable)
    ├── Console (development)
    ├── Custom endpoint (production)
    ├── Datadog / Sentry / etc.
    └── No-op (default)
```

Developers provide an adapter; laRose emits structured events.

```typescript
import {
  createConsoleAdapter,
  createSentryAdapter,
  createWebhookAdapter,
  createCompositeAdapter,
} from '@larose-ui/observability';

const adapter = createCompositeAdapter(
  createConsoleAdapter(),
  createSentryAdapter({ environment: 'production' }),
  createWebhookAdapter('https://analytics.example.com/ui-events'),
);
```

### Development diagnostics

In development mode, warnings appear in console:

```text
laRose WARNING
Component: EmployeeTable
Problem: Missing permission definition
Suggested fix: Define employees.read
```

### Performance monitoring

```typescript
// Automatic in ObservedComponent
{
  component: 'DataTable',
  renderTime: 48, // ms
  rowCount: 500,
  threshold: 'ok' | 'slow' | 'critical'
}
```

### Error recovery tracking

Track retry behavior:

```text
error → retry clicked → success | abandoned
```

Measure self-healing effectiveness.

### Privacy

- No PII in default events
- Field values never logged
- Opt-in for detailed interaction tracking
- Tenant isolation in event payloads

### Phase rollout

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 4a | Event emitter + ObservedForm | Done |
| 4b | Performance measurement | Done |
| 4c | Rage click / dead button detection | Done |
| 4d | Production adapters (Sentry, webhook) | Done — `createSentryAdapter`, `createWebhookAdapter` |

### Metrics export

Support Prometheus-style counters and custom webhook batching for enterprise dashboards.

---

## Security

### Core principle

> The UI is NOT the authorization layer.

Real authorization must always be enforced by the backend. laRose ensures the UI **correctly reflects** the security model — never replaces it.

### Permission-aware UI

```jsx
<Can permission="employees.delete" fallback="hidden">
  <DeleteButton />
</Can>
```

Fallback modes:

| Mode | Behavior |
|------|----------|
| hidden | Not rendered (default for destructive) |
| disabled | Visible but non-interactive |
| forbidden | Visible with forbidden message |
| readonly | Display-only |

Never expose sensitive data assuming UI hiding is sufficient.

### Session & authentication

Support UI patterns for:

- Session expiration → redirect to login with return URL
- 401 responses → automatic session refresh or logout flow
- 403 responses → forbidden state with explainable message
- Token refresh without user disruption

### Sensitive actions

- Confirmation dialogs for irreversible operations
- Audit trail integration (`<AuditedInput />`)
- Rate limiting UI (429 → countdown retry)
- Production environment warnings (visual indicators)

### Tenant isolation

- Tenant context flows through all providers
- UI never mixes tenant data in shared state
- Tenant-specific theming does not leak tokens across tenants
- Feature flags scoped to tenant/org/user

### Data handling

- No secrets in client-side code or tokens
- Sensitive fields (salary, SSN) support masked display
- Form drafts encrypted in local storage (offline package)
- Clipboard restrictions for sensitive data (optional)

### XSS prevention

- React's default escaping
- No `dangerouslySetInnerHTML` in core components
- Sanitized rich text via explicit opt-in component (future)

### CSRF

- Mutation requests include CSRF tokens when configured
- `@larose-ui/data` supports CSRF header injection

### Content Security Policy

Document recommended CSP headers for apps using laRose:

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';  /* runtime tokens require inline CSS vars */
img-src 'self' data: https:;
```

### Security-aware component states

| Scenario | UI Response |
|----------|-------------|
| Unauthorized action | Hidden or explainable disabled |
| Session expired | Modal + redirect |
| Sensitive field edit | Audit log + confirmation |
| Production destructive op | Enhanced confirmation + env badge |
| Cross-tenant access attempt | Error boundary + report |

### Dependency security

- Automated dependency scanning in CI
- Pin major versions in apps
- Regular `@larose-ui/*` security patches

### Compliance considerations

Architecture supports (implementation per app):

- GDPR — consent UI patterns, data export triggers
- HIPAA — audit trails, access logging hooks
- SOC 2 — observability event trails

laRose provides hooks; compliance logic remains in the application layer.

---

## Testing strategy

### Philosophy

Quality is measured by **behavior coverage**, not component count.

Every important feature must consider:

```text
Behavior | Accessibility | Visual | Performance
Network | Permission | Error | Offline
Responsive | i18n | RTL | Dark mode
```

### Test matrix

Example: Employee Creation

| Scenario | Type | Priority |
|----------|------|----------|
| Normal flow | Integration | P0 |
| Validation errors | Unit + Integration | P0 |
| Server error (500) | Integration | P0 |
| Offline submit | Integration | P1 |
| Retry after failure | Integration | P1 |
| Permission denied | Integration | P0 |
| Slow network (skeleton) | Visual + Integration | P1 |
| Mobile viewport | Visual | P1 |
| RTL layout | Visual | P1 |
| Dark mode | Visual regression | P1 |
| Accessibility (axe) | Automated | P0 |
| Visual regression | Snapshot | P1 |

### Test layers

#### Unit tests (Vitest)

- `@larose-ui/core` state machines, error classifiers, utilities
- Token generation and density scaling
- Permission evaluators
- Pure functions only — no DOM unless necessary

#### Component tests (Vitest + Testing Library)

- Render all UI states (loading, error, disabled, etc.)
- User interactions (click, type, keyboard)
- ARIA attributes and roles
- Focus management for overlays

#### Integration tests

- `<DataView />` with mock API
- `<Form />` with server validation
- `<Can />` with permission provider
- Offline queue sync flow

#### Accessibility tests

- axe-core in every component test suite
- `@larose-ui/accessibility` validation utilities
- CI gate: zero critical violations

#### Visual regression

- Storybook stories as snapshot source
- Chromatic or Playwright screenshot comparison
- Matrix: light/dark × densities × breakpoints × states

#### Performance tests

- Bundle size budgets per package
- Render time benchmarks for DataTable, Form
- CI fails on >10% regression

#### Contract tests

- `@larose-ui/contracts` validates UI expectations against API schemas
- Runs in CI on schema changes

### Package test requirements

| Package | Unit | Component | A11y | Visual |
|---------|------|-----------|------|--------|
| core | ✅ | — | — | — |
| tokens | ✅ | — | — | — |
| react | ✅ | ✅ | ✅ | ✅ |
| data | ✅ | ✅ | ✅ | — |
| permissions | ✅ | ✅ | ✅ | — |
| forms | ✅ | ✅ | ✅ | ✅ |
| runtime | ✅ | ✅ | ✅ | — |

### CI pipeline

```text
lint → typecheck → unit → component → a11y → visual → perf budgets → contracts
```

### Testing utilities (`@larose-ui/testing`)

Provides:

```tsx
import { renderWithLaRose, mockPermissions, mockNetwork } from '@larose-ui/testing';

renderWithLaRose(<EmployeeTable />, {
  permissions: ['employees.read'],
  network: 'slow',
  theme: 'dark',
  density: 'compact',
});
```

### Coverage targets

- `@larose-ui/core`: 90%+ line coverage
- `@larose-ui/react` foundation components: 80%+ with state matrix
- Intelligence packages: 85%+ on public API paths

### What we don't test

- Third-party library internals
- Trivial prop forwarding without logic
- Snapshot-only tests without behavioral assertions

---

## DevOps strategy

### Component quality gate

Every important component/package must pass before merge:

```text
✓ Unit tests pass
✓ Component tests pass
✓ Accessibility (axe) — zero critical violations
✓ TypeScript strict — no errors
✓ Lint — no errors
✓ Bundle size within budget
✓ Visual regression — no unexpected diffs
✓ Contract validation — no mismatches
```

### CI/CD pipeline

#### Pull request

```text
1. Install (pnpm, frozen lockfile)
2. turbo lint typecheck test
3. turbo build
4. Accessibility scan (axe on Storybook)
5. Bundle size report
6. Visual regression (on label or main packages)
```

#### Release

```text
1. Changeset version bump
2. Full test matrix
3. Build all packages
4. Publish to npm (@larose-ui/*)
5. Deploy Storybook to static hosting
6. Generate migration report if major
```

### Monorepo tooling

| Tool | Purpose |
|------|---------|
| pnpm | Package management, workspace linking |
| Turborepo | Cached builds, task orchestration |
| Changesets | Versioning and changelogs |
| tsup | Library bundling |
| Vitest | Unit and component tests |
| ESLint + Prettier | Code quality |
| Storybook | Component playground + visual QA |

### Performance budgets

| Package | Max ESM Size (gzip) |
|---------|---------------------|
| @larose-ui/core | 5 KB |
| @larose-ui/tokens | 3 KB |
| @larose-ui/react (tree-shaken Button) | 2 KB |
| @larose-ui/react (full) | 70 KB |

CI compares against baseline; >10% increase fails the build.

### Browser compatibility matrix

| Browser | Support Level |
|---------|---------------|
| Chrome (last 2) | Full |
| Firefox (last 2) | Full |
| Safari (last 2) | Full |
| Edge (last 2) | Full |
| iOS Safari (last 2) | Full |
| Android Chrome (last 2) | Full |

Partial support documented per component when applicable.

### Release versioning

- **Patch** — bug fixes, no API change
- **Minor** — new components/features, backward compatible
- **Major** — breaking changes + migration codemods

### Environment strategy

Runtime environments supported:

```text
development | staging | production | demo | read-only | maintenance
```

Build-time env vars for CI only. Runtime environment set via `EnvironmentProvider`.

### Documentation deployment

- Storybook → static site (component playground)
- Architecture docs → this README (single source of truth)
- API reference generated from TypeScript (future)

### Security in DevOps

- Dependabot / Renovate for dependency updates
- No secrets in repo — `.env` gitignored
- npm provenance on publish
- SBOM generation on release

### Local developer workflow

```bash
pnpm install
pnpm dev          # Storybook playground
pnpm test         # all tests
pnpm lint         # ESLint (packages + apps)
pnpm build        # all packages
pnpm run doctor   # quality gates (budgets, deprecations, contracts, a11y)
```

---

## Publishing

This monorepo publishes scoped packages under `@larose-ui/*` using [Changesets](https://github.com/changesets/changesets).

### Prerequisites

1. npm account with access to the `@larose-ui` scope
2. `NPM_TOKEN` set in CI (GitHub secret) for automated releases
3. Update repository URLs if needed:

```bash
LAROSE_REPO_URL=https://github.com/YOUR_ORG/laRose.git node scripts/sync-publish-metadata.mjs
```

### Verify readiness

```bash
pnpm build
pnpm test
pnpm run doctor
pnpm verify:publish
```

### Release workflow (maintainers)

#### 1. Record changes

```bash
pnpm changeset
```

Select affected packages and bump type (patch/minor/major). Commit the generated `.changeset/*.md` file.

#### 2. Version packages

```bash
pnpm version-packages
```

Updates package versions and changelogs. Commit the result.

#### 3. Publish to npm

```bash
pnpm release:publish
```

Runs build and `changeset publish`. Requires `npm login` locally or `NPM_TOKEN` in CI.

### CI automation

`.github/workflows/release.yml` runs on push to `main` when Changesets are present. It opens a "Version Packages" PR or publishes when merged.

### Package list

All packages in `packages/*` are published except private apps:

- `@larose-ui/playground` (Storybook)
- `@larose-ui/demo` (Vite integration demo)

### First-time npm setup

```bash
npm login
npm access public @larose-ui   # if scope is new
pnpm verify:publish
pnpm release:publish
```

### After publish

Consumers install with:

```bash
pnpm add @larose-ui/runtime @larose-ui/react @larose-ui/tokens
```

---

## Migration guide

Step-by-step upgrades between laRose versions.

### Deprecation policy

1. **Minor version** — deprecate with console/runtime warnings
2. **One major cycle** — deprecated API still works
3. **Next major** — removed with codemod provided

Detection and fixes: `larose migrate`, `larose doctor`, and `@larose-ui/migration` codemods. Token renames ship with `@larose-ui/tokens/legacy-aliases.css` for one major cycle.

### Quick commands

```bash
# Scan for deprecated patterns (includes Storybook / apps/playground)
pnpm exec node packages/cli/dist/cli.js migrate --to 1.0.0

# Apply safe automated fixes
pnpm exec node packages/cli/dist/cli.js migrate --to 1.0.0 --apply

# Full quality check after migration
pnpm run doctor
```

### v0.x → v1.0

#### 1. Import `LaRoseProvider` from runtime

**Before**

```tsx
import { LaRoseProvider, Button } from '@larose-ui/react';
```

**After**

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button } from '@larose-ui/react';
```

**Automated:** yes (`larose migrate --apply`)

---

#### 2. Rename design tokens

**Before**

```css
.card {
  color: var(--ui-color-primary);
  background: var(--ui-color-surface);
}
```

**After**

```css
.card {
  color: var(--lr-color-primary);
  background: var(--lr-color-surface);
}
```

**Transitional:** import legacy aliases while migrating:

```tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/tokens/legacy-aliases.css'; // temporary — remove before v2
```

**Automated:** yes (`larose migrate --apply` renames in source files)

---

#### 3. Replace inline role checks

**Before**

```tsx
if (user.role === 'admin') {
  return <DeleteButton />;
}
```

**After**

```tsx
import { Can } from '@larose-ui/permissions';

<Can permission="employees.delete">
  <DeleteButton />
</Can>
```

**Automated:** no — requires manual refactor (reported by `larose migrate`)

---

#### 4. Replace deprecated hooks

**Before**

```tsx
import { useLaRose } from '@larose-ui/runtime';

const { theme } = useLaRose();
```

**After**

```tsx
import { useTheme } from '@larose-ui/runtime';

const { theme } = useTheme();
```

**Runtime warning:** `useLaRose()` logs a one-time dev warning pointing to `useTheme()`.

---

### Validating your migration

1. Run `pnpm run doctor` — must pass with zero errors
2. Run `pnpm test` and `pnpm a11y`
3. Smoke-test Storybook: `pnpm dev` → **Platform/Full Demo**

### Breaking changes in v1.0

| Change | Migration |
|--------|-----------|
| `LaRoseProvider` removed from `@larose-ui/react` | Import from `@larose-ui/runtime` |
| `--ui-color-*` tokens removed | Use `--lr-color-*` or legacy aliases temporarily |
| Inline `user.role` checks | Use `<Can permission="...">` |
| `useLaRose()` deprecated | Use `useTheme()` |

---

## Changelog

All notable changes to laRose packages are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [Unreleased]

#### Added

- Automated codemods in `@larose-ui/migration` (`applyCodemods`, token renames, provider import fixes)
- `larose migrate --apply` CLI flag
- Legacy token alias stylesheet `@larose-ui/tokens/legacy-aliases.css`
- Runtime deprecation warnings via `warnDeprecation()` in `@larose-ui/core`
- Migration guide with before/after examples (see [Migration guide](#migration-guide))

### [0.1.0] - 2026-08-29

Initial public platform release.

#### Added

**Foundation**
- `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react`, `@larose-ui/playground`

**Runtime**
- `@larose-ui/network`, `@larose-ui/offline`, `@larose-ui/runtime`
- i18n (en, ar, de), RTL, AdaptiveTable, OfflineForm

**Intelligence**
- `@larose-ui/permissions`, `@larose-ui/data`, `@larose-ui/forms`
- Feature flags, undo UX, explainable UI

**Observability**
- `@larose-ui/observability` — event collector, funnel metrics, rage click detection

**DevOps**
- `@larose-ui/contracts`, `@larose-ui/migration`, `@larose-ui/testing`, `@larose-ui/cli`, `@larose-ui/devtools`
- CI pipeline, bundle budgets, `larose doctor`

**Enterprise & AI**
- `@larose-ui/enterprise` — audit trails, version compatibility, UI schema IaC, security patterns
- `@larose-ui/ai` — SmartTable, SmartForm, pluggable adapters

**Production readiness**
- `@larose-ui/accessibility` — component source scanner
- Changesets release workflow

[Unreleased]: https://github.com/hamdymohamedak/larose-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/hamdymohamedak/larose-ui/releases/tag/v0.1.0

---

## Contributing

Thank you for your interest in contributing to laRose — the UI Operating System for Modern SaaS Applications.

This section explains how to set up the project, submit changes, and meet our quality standards.

### Prerequisites

- **Node.js** 20 or later
- **pnpm** 9 (see `packageManager` in root `package.json`)

### Setup

```bash
git clone <repository-url>
cd laRose
pnpm install
pnpm build
pnpm test
```

Verify your environment:

```bash
pnpm run doctor
pnpm a11y
```

### Storybook playground

```bash
pnpm dev   # http://localhost:6006
```

Use Storybook to develop and validate components across themes, locales, permissions, and network states.

### Project structure

laRose is a **pnpm + Turborepo** monorepo.

```text
laRose/
├── packages/          # Publishable @larose-ui/* libraries
├── apps/
│   └── playground/    # Storybook (private, not published)
├── contracts/         # Sample UI/API contract schemas
├── scripts/           # CI helpers (budgets, a11y audit)
└── .github/workflows/ # CI and release automation
```

See [Package structure](#package-structure) and [Architecture](#architecture) for details.

### Development workflow

1. **Create a branch** from `main` with a descriptive name (e.g. `feat/smart-form-adapter`, `fix/session-guard-a11y`).
2. **Make focused changes** — one concern per pull request when possible.
3. **Add or update tests** for behavior you introduce or change.
4. **Run quality gates locally** before opening a PR (see below).
5. **Open a pull request** with a clear summary and test plan.

#### Working on a single package

```bash
pnpm --filter @larose-ui/react test
pnpm --filter @larose-ui/runtime build
```

Turbo caches builds across packages; run `pnpm build` at the root before testing packages that depend on others.

### Quality gates

All pull requests must pass CI. Run these locally:

| Command | Purpose |
|---------|---------|
| `pnpm typecheck` | TypeScript strict checks |
| `pnpm test` | Unit and component tests |
| `pnpm build` | Build all packages |
| `pnpm run doctor` | Bundle budgets, deprecations, contracts, a11y heuristics |
| `pnpm check-budgets` | Fail on bundle size overages |
| `pnpm a11y` | Accessibility scan of `@larose-ui/react` sources |

See [DevOps strategy](#devops-strategy) and [Testing strategy](#testing-strategy) for details.

#### Testing conventions

- Use **Vitest** for unit and component tests.
- Wrap React components with `renderWithLaRose()` from `@larose-ui/testing` when runtime context is required.
- Prefer testing behavior and accessibility over implementation details.

#### Accessibility

- Dialogs and modals must have accessible labels (`title`, `aria-labelledby`, or `aria-label`).
- Interactive elements need visible text or an `aria-label`.
- Run `pnpm a11y` after changing components in `@larose-ui/react`.

### Pull request guidelines

#### Title format

Use a concise, imperative summary:

```text
feat(ai): add OpenAI adapter for SmartForm
fix(data): dispatch session-expired only on 401
docs: update getting started examples
```

#### Description

Include:

1. **What** changed and **why**
2. **How to test** (commands, Storybook stories, screenshots if UI changed)
3. **Breaking changes** (if any) and migration notes

#### Scope

- Match existing code style and patterns in the package you edit.
- Avoid unrelated refactors in the same PR.
- Do not commit secrets, `.env` files, or local IDE settings.

### Changesets and releases

Published packages use [Changesets](https://github.com/changesets/changesets) for versioning and changelogs.

When your change affects the public API or behavior of a published `@larose-ui/*` package:

```bash
pnpm changeset
```

Follow the prompts, commit the generated file in `.changeset/`, and include it in your PR.

Maintainers run `pnpm version-packages` and `pnpm release` to publish (requires `NPM_TOKEN` in CI).

See [Publishing](#publishing) and [Migration guide](#migration-guide).

### Architecture constraints

Please respect these boundaries:

1. **`@larose-ui/core` has zero dependencies** — keep primitives framework-agnostic.
2. **No circular dependencies** between packages.
3. **`LaRoseProvider` lives in `@larose-ui/runtime`**, not `@larose-ui/react`.
4. **Permissions are resource.action strings** — avoid inline `user.role === "admin"` patterns.
5. **UI is not the authorization layer** — backend must enforce access; UI reflects the model.
6. **Intelligence packages compose at the app layer** — avoid cross-dependencies between `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions`, etc.

See [Security](#security) for security patterns.

### Where to ask questions

- Open a **GitHub issue** for bugs, feature requests, or design discussions.
- Reference relevant sections in this README in your issue for faster triage.

Thank you for helping make laRose better.

---

## Code of conduct

### Our pledge

We pledge to make participation in the laRose project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our standards

Examples of behavior that contributes to a positive environment:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy toward other community members

Examples of unacceptable behavior:

- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying standards and may take appropriate and fair corrective action in response to any behavior they deem inappropriate, threatening, offensive, or harmful.

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening a confidential issue or contacting the maintainers directly. All complaints will be reviewed and investigated promptly and fairly.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.1.

---

## License

MIT
