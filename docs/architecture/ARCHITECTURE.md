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
                   @larose-ui/permissions Feature Flags, i18n
                   @larose-ui/ai         Network, Offline
        │                │                │
        └────────────────┼────────────────┘
                         │
                   Observability
                   @larose-ui/observability
                         │
                    Quality Engine
              Doctor + CLI + Testing + A11y
```

## Package Rules

1. `@larose-ui/core` has zero dependencies — types, state machines, runtime contracts
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
