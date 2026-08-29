# laRose Package Structure

## Monorepo Layout

```text
laRose/
├── packages/
│   ├── core/              @larose/core
│   ├── tokens/            @larose/tokens
│   ├── react/             @larose/react
│   ├── runtime/           @larose/runtime        (Phase 2)
│   ├── network/           @larose/network        (Phase 2)
│   ├── offline/           @larose/offline        (Phase 2)
│   ├── data/              @larose/data           (Phase 3)
│   ├── permissions/       @larose/permissions    (Phase 3)
│   ├── forms/             @larose/forms          (Phase 3)
│   ├── observability/     @larose/observability  (Phase 4)
│   ├── accessibility/     @larose/accessibility  (Phase 2)
│   ├── testing/           @larose/testing        (Phase 5)
│   ├── contracts/         @larose/contracts      (Phase 5)
│   ├── cli/               @larose/cli            (Phase 5)
│   ├── devtools/          @larose/devtools       (Phase 5)
│   ├── migration/         @larose/migration      (Phase 5)
│   ├── ai/                @larose/ai             (Phase 6)
│   ├── enterprise/        @larose/enterprise     (Phase 6)
│   └── themes/            @larose/themes         (Phase 2)
├── apps/
│   ├── playground/        @larose/playground     Storybook
│   └── demo/              @larose/demo           Vite integration demo
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Package Responsibilities

### `@larose/core`

Framework-agnostic foundation:

- Shared TypeScript types (`UIState`, `AsyncState`, `Density`, `Environment`)
- Async state machine factory
- Error classification utilities
- Event emitter for observability hooks

**Dependencies:** none  
**Dependents:** all packages

### `@larose/tokens`

Runtime design token system:

- Token definitions (color, typography, spacing, radius, shadow, motion)
- CSS custom property generation
- Theme presets (light, dark)
- Density scaling

**Dependencies:** `@larose/core`  
**Dependents:** `@larose/react`, `@larose/runtime`, `@larose/themes`

### `@larose/react`

React component library:

- All UI components with production state support
- Re-exports token utilities for convenience
- Peer dependency on React 18+

**Dependencies:** `@larose/core`, `@larose/tokens`  
**Dependents:** apps, intelligence packages

### `@larose/runtime`

Composed provider tree:

- `LaRoseProvider`
- Theme, tenant, i18n, environment providers

**Dependencies:** `@larose/core`, `@larose/tokens`, `@larose/react`  
**Dependents:** apps

### `@larose/data`

Backend-aware UI:

- `Query`, `Mutation`, `DataView`, `Resource`
- HTTP client with error mapping
- Pagination helpers

**Dependencies:** `@larose/core`, `@larose/react`  
**Dependents:** `@larose/forms`, demo apps

### `@larose/permissions`

Authorization-aware UI:

- `Can`, `Permission`
- RBAC/ABAC evaluators
- Permission loading states

**Dependencies:** `@larose/core`, `@larose/react`

### `@larose/forms`

Schema-driven forms:

- `<Form schema={...} />`
- Conditional/dependent fields
- Server validation integration

**Dependencies:** `@larose/core`, `@larose/react`, `@larose/data`

### `@larose/observability`

UX telemetry:

- `ObservedForm`, interaction tracking
- Performance measurement
- Metric exports

**Dependencies:** `@larose/core`, `@larose/react`

### `@larose/themes`

Named theme presets and tenant branding helpers:

- Built-in presets (`default`, `ocean`, `forest`, `sunset`)
- `applyThemePreset()` for runtime branding
- Re-exports `createTenantTheme` from `@larose/tokens`

**Dependencies:** `@larose/core`, `@larose/tokens`  
**Dependents:** apps, `@larose/runtime` (optional)

**Status:** Implemented

### `@larose/accessibility`

A11y utilities and validators:

- Component source scanner (`scanComponentSource`)
- Integrated with `larose doctor` and CI (`pnpm a11y`)
- Recommended CSP export

**Dependencies:** `@larose/core`

**Status:** Implemented

### `@larose/cli`

Developer tooling:

- `larose doctor`
- `larose migrate`
- `larose generate`

**Dependencies:** multiple `@larose/*` for validation

### `@larose/enterprise`

Enterprise patterns:

- `AuditedInput`, audit trail provider
- `VersionProvider`, compatibility checks
- UI schema IaC (`SchemaRenderer`, `compileFormSchema`)
- `SessionGuard`, `SensitiveAction`

**Dependencies:** `@larose/core`, `@larose/forms`, `@larose/permissions`, `@larose/runtime`, `@larose/react`

### `@larose/ai`

Pluggable AI intelligence layer:

- `SmartTable` — natural language filtering
- `SmartForm` — natural language field population
- `AIAdapter` interface + mock adapter for demos

**Dependencies:** `@larose/forms`, `@larose/runtime`, `@larose/react`

### `@larose/playground`

Storybook app for component state matrix testing.

**Dependencies:** `@larose/react`, `@larose/tokens`

## Dependency Rules

1. **No circular dependencies** — enforced by Turborepo + manual review
2. **Core has zero deps** — keeps primitives portable
3. **React is peer dep** — only in `@larose/react` and above
4. **Intelligence packages don't depend on each other** — compose at app level
5. **DevTools/CLI are leaf packages** — depend on others, nothing depends on them

## Build Output

Each package publishes:

```text
dist/
├── index.js      (ESM)
├── index.d.ts    (types)
└── index.css     (if applicable)
```

Format: ESM only. `"type": "module"` throughout.

## Versioning

Independent semver per package, coordinated via Changesets:

```text
@larose/core@0.1.0
@larose/tokens@0.1.0
@larose/react@0.1.0
```

Breaking changes in `@larose/core` trigger major bumps in dependent packages.
