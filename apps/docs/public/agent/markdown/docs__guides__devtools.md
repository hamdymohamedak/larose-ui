# DevTools

# DevTools 2.0 (Phase 2)

Real-time frontend runtime inspector consuming `useRuntime()` and `useRuntimeEvents()`.

## Planned Capabilities

- Component tree + element picker
- Runtime context panel (all LaRoseRuntimeContext fields)
- Chronological timeline from event bus
- Permission, network, feature flag, theme, tenant views
- Performance metrics per component

## Current State (v0.1)

`DevToolsPanel` includes:

- **Context** — runtime slices (session, tenant, permissions, network, feature flags)
- **Timeline** — chronological events from `useRuntimeEvents()`
- **Inspector** — element selection mode with DOM readout, React fiber props, and observability render metrics

Inspect mode ignores clicks inside the DevTools panel (`data-lr-devtools`). Enable selection via the **Select mode** checkbox on the Inspector tab.

### Fiber introspection (dev-only)

When a selected element has a React fiber attached, the inspector resolves the nearest component `displayName` and sanitized props (functions redacted, values truncated). Performance metrics come from `@larose-ui/observability` `performance` events when `ObservedComponent` wraps the target.

## Integration

```tsx
import { DevToolsProvider } from '@larose-ui/devtools';

<LaRoseProvider onRuntimeEvent={(e) => devtools.ingest(e)}>
  <DevToolsProvider />
  <App />
</LaRoseProvider>
```
