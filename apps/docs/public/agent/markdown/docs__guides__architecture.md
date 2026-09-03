# Architecture

# laRose Architecture

laRose is a **UI Operating System** for modern SaaS applications — not a component library.

## Layer Model

```text
                    laRose UI OS
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     UI Layer       Intelligence        Runtime
        │                │                │
   @larose-ui/react   @larose-ui/data      @larose-ui/runtime
   Components      @larose-ui/forms     Theme, Tenant, Session
   @larose-ui/styles @larose-ui/permissions Feature Flags, i18n
        │           @larose-ui/ai         Network, Offline
        │                │                │
        └────────────────┼────────────────┘
                         │
                   Observability
                   @larose-ui/observability
                         │
                    Quality Engine
              Doctor + CLI + Testing + A11y
```

## Shared styles

Component CSS lives in `@larose-ui/styles` (framework-agnostic). Import tokens first, then shared component styles:

```ts
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
```

`@larose-ui/react/styles.css` remains available for backward compatibility.

## Runtime core

Framework-independent runtime logic lives in `@larose-ui/runtime-core` (store, bridges, tenant, i18n, host detection). `@larose-ui/runtime` is the React adapter (`LaRoseProvider`, hooks) and mounts `AcceleratorProvider` from `@larose-ui/react`.

The lightweight `LaRoseProvider` in `@larose-ui/react` remains for theme/motion-only setups without the full runtime stack.

## Component contracts

Canonical component APIs live in `contracts/components/*.json`, validated by `@larose-ui/contracts` and `larose doctor`. Regenerate from React with:

```bash
pnpm generate:contracts
```

## Headless primitives

Interactive behavior lives in `@larose-ui/primitives` (menu type-ahead, keyboard, mnemonics). `@larose-ui/react` is a thin rendering adapter.

## Intelligence core adapters

Framework-independent quality and telemetry logic lives in `-core` packages. React adapters re-export for backward compatibility:

| Core | React adapter |
|------|----------------|
| `@larose-ui/observability-core` | `@larose-ui/observability` |
| `@larose-ui/permissions-core` | `@larose-ui/permissions` |
| `@larose-ui/devtools-core` | `@larose-ui/devtools` |
| `@larose-ui/quality-core` | `@larose-ui/cli` (doctor runner) |

Doctor reads `larose.config.json` for framework-specific component and story paths. Add Vue/Svelte targets there when those bindings exist.

## Meta-framework adapters

| Package | Role |
|---------|------|
| `@larose-ui/next` | Next.js / SSR helpers — CSS paths, theme bootstrap script, `LaRoseRoot` client boundary |
| `@larose-ui/vue` | Vue 3 components + `LaRoseProvider` + `RuntimeProvider` |
| `@larose-ui/nuxt` | Nuxt module — CSS, theme script, `LaRoseApp`, auto-imports |
| `@larose-ui/svelte` | Svelte 5 components + `LaRoseProvider` + `RuntimeProvider` |
| TanStack Start | Same React packages; see [TANSTACK_START.md](../ecosystem/TANSTACK_START.md) |

See [VUE.md](../ecosystem/VUE.md), [NEXTJS.md](../ecosystem/NEXTJS.md), and [SVELTE.md](../ecosystem/SVELTE.md). Framework packages do not duplicate components — they consume shared styles, tokens, primitives, and runtime-core.

## Package Rules

1. `@larose-ui/core` has zero dependencies — types, state machines, runtime contracts
2. No circular dependencies between packages
3. Intelligence packages compose at the app layer — not each other
4. Runtime orchestrates; domain packages implement
5. DevTools and CLI are leaf packages
6. `-core` packages must not depend on React, Vue, or Svelte

## Runtime ↔ DevTools ↔ Doctor Triad

Every metric captured in **Runtime** must be inspectable in **DevTools**.
Every detectable issue must be auditable by **Doctor** in CI.

## Dependency Graph

See [RUNTIME_2.md](../runtime/RUNTIME_2.md) for Runtime 2.0 design.

## Examples

### Basic

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button } from '@larose-ui/react';

<LaRoseProvider locale="en" permissions={['app.read']}>
  <Button>Save</Button>
</LaRoseProvider>
```

### Enterprise

```tsx
<LaRoseProvider
  tenant={{ id: 'acme', timezone: 'Africa/Cairo' }}
  user={{ id: 'ahmed', roles: ['hr-manager'] }}
  session="authenticated"
  featureFlagEvaluator={rolloutEvaluator}
  version={{ frontend: '3.2.0', api: 'v4' }}
>
  <App />
</LaRoseProvider>
```

### Production

```tsx
<LaRoseProvider
  environment="production"
  observabilityAdapter={sentryAdapter}
  onRuntimeEvent={(e) => pipeline.ingest(e)}
  session="authenticated"
>
  <SessionGuard loginUrl="/login">
    <App />
  </SessionGuard>
</LaRoseProvider>
```
