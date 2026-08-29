# laRose Architecture

> The UI Operating System for Modern SaaS Applications

## Vision

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

## Layer Model

### UI Layer

Presentational and behavioral components that understand production states:

```text
Loading | Success | Error | Empty | Disabled | Read Only
Unauthorized | Offline | Retry | Optimistic Update | Rollback
```

Components are built on `@larose/core` primitives and styled via `@larose/tokens`.

### Intelligence Layer

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

### Runtime Layer

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

### Observability Layer

Every major component can opt into telemetry:

```jsx
<ObservedForm name="employee-create" />
```

Tracks: open rate, completion rate, error rate, abandonment, rage clicks, dead buttons, slow renders.

## State Management Strategy

**Principle:** Use explicit state machines over boolean soup.

```text
idle → loading → success | error → retrying
```

- Local UI state: React `useState` / `useReducer`
- Async lifecycle: `@larose/core` state machine (`createAsyncStateMachine`)
- Server state: `@larose/data` (Query/Mutation abstractions, TanStack Query compatible)
- Global runtime: React Context providers (theme, permissions, network)
- Offline queue: `@larose/offline` persistent queue with IndexedDB

No global Redux store. Context + server-state library keeps boundaries clear.

## API / Data Layer Strategy

```text
Backend Contract → UI Contract → Component
```

- HTTP client with automatic error classification (401, 403, 404, 409, 422, 429, 500)
- Self-healing error messages with retry/backoff
- Contract validation in CI via `@larose/contracts`
- Pagination, empty, and unauthorized states handled by `<DataView />`

## Package Dependency Graph

```text
@larose/tokens
@larose/core
    ↓
@larose/react ← @larose/accessibility
    ↓
@larose/runtime (theme, responsive, network, offline)
    ↓
@larose/data | @larose/permissions | @larose/forms
    ↓
@larose/observability | @larose/ai
    ↓
@larose/devtools | @larose/cli | @larose/migration
```

Apps depend on `@larose/react` + selected intelligence packages. Tree-shakeable ESM.

## Runtime Architecture

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

## Technology Choices

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

## Accessibility Architecture

Built into `@larose/accessibility`:

- Focus trap, focus restore, aria-labelledby/describedby for overlays
- Keyboard navigation contracts for all interactive components
- Reduced motion via token system
- Development warnings + CI axe checks via `@larose/cli doctor`

## Theming / Token Architecture

Runtime CSS custom properties injected by `@larose/tokens`:

```text
Global defaults → Brand → Organization → Tenant → User preference
```

No rebuild required for tenant rebrand. Density (compact/comfortable/spacious) scales spacing and typography consistently.

## Permissions Architecture

```jsx
<Can permission="employees.delete" fallback="hidden">
  <DeleteButton />
</Can>
```

Supports: visible, hidden, disabled, read-only, forbidden, permission-loading.

Never use `user.role === "admin"` as the primary pattern. Permissions are resource.action strings evaluated by `@larose/permissions`.

## Offline Architecture

```text
User action → Local persist → Queue → Sync when online → Reconcile
```

Conflict resolution with rollback. Optimistic updates with undo.

## AI Integration Architecture

Pluggable AI adapters behind `@larose/ai`:

- `<SmartTable />` — natural language filtering
- `<SmartForm />` — natural language field population

Components expose stable APIs; AI is an optional intelligence layer, not a breaking dependency.

## DevTools Architecture

Browser extension + in-app panel (`@larose/devtools`):

- Component tree, permissions, network, feature flags, theme, tenant, performance, errors

## CLI Architecture

```bash
larose doctor    # a11y, deprecated APIs, contracts, permissions
larose migrate   # codemods for version upgrades
larose generate  # scaffold pages/forms from schema
```

## Release / Versioning Strategy

- Semver per package (`@larose/react@1.2.0`)
- Changesets for changelog + coordinated releases
- LTS branches for enterprise customers
- Migration codemods ship with every major version

## Non-Goals (remaining)

- Browser DevTools extension (in-app `@larose/devtools` panel ships instead)
- Rich calendar UI date pickers (foundation `@larose/react` ships token-styled native date/time inputs)
- Hosted observability backend (adapters emit to your stack)
- Public docs site / generated API reference (architecture docs in repo for now)
