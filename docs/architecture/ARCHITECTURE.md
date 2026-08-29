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
   @larose/react   @larose/data      @larose/runtime
   Components      @larose/forms     Theme, Tenant, Session
                   @larose/permissions Feature Flags, i18n
                   @larose/ai         Network, Offline
        │                │                │
        └────────────────┼────────────────┘
                         │
                   Observability
                   @larose/observability
                         │
                    Quality Engine
              Doctor + CLI + Testing + A11y
```

## Package Rules

1. `@larose/core` has zero dependencies — types, state machines, runtime contracts
2. No circular dependencies between packages
3. Intelligence packages compose at the app layer — not each other
4. Runtime orchestrates; domain packages implement
5. DevTools and CLI are leaf packages

## Runtime ↔ DevTools ↔ Doctor Triad

Every metric captured in **Runtime** must be inspectable in **DevTools**.
Every detectable issue must be auditable by **Doctor** in CI.

## Dependency Graph

See [RUNTIME_2.md](../runtime/RUNTIME_2.md) for Runtime 2.0 design.

## Examples

### Basic

```tsx
import { LaRoseProvider } from '@larose/runtime';
import { Button } from '@larose/react';

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
