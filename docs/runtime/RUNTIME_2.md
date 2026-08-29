# Runtime 2.0 Specification

Phase 1 delivers a unified frontend operating environment via `@larose/runtime` and `@larose/core`.

## Goals

- Single inspectable context: `useRuntime()`
- Chronological event bus for DevTools timeline
- Session, tenant, version, timezone, accessibility in runtime
- Feature flag evaluators with rollout support
- Backward-compatible additive API

## Unified Context

```typescript
interface LaRoseRuntimeContext {
  environment: Environment;
  tenant: TenantContext | null;
  user: UserContext | null;
  session: SessionState;
  permissions: PermissionSnapshot;
  features: FeatureFlagSnapshot;
  network: NetworkSnapshot;
  offline: OfflineSnapshot;
  locale: LocaleSnapshot;
  timezone: string;
  theme: ThemeSnapshot;
  accessibility: A11yPreferences;
  version: VersionMatrix;
}
```

## Public API

| API | Package | Purpose |
|-----|---------|---------|
| `useRuntime()` | `@larose/runtime` | Full context snapshot |
| `useRuntimeSelector(fn)` | `@larose/runtime` | Derived slice |
| `useRuntimeEvents()` | `@larose/runtime` | Timeline + emit |
| `useSession()` | `@larose/runtime` | Session state |
| `createRuntimeEventBus()` | `@larose/core` | Event bus factory |
| `createSessionStateMachine()` | `@larose/core` | Session transitions |
| `createPercentageRolloutEvaluator()` | `@larose/core` | Feature rollout |

## Provider Tree

```text
RuntimeContextProvider
  └── ThemeProvider
        └── ObservabilityProvider
              └── I18nProvider
                    └── PermissionProvider
                          └── FeatureFlagProvider
                                └── EnvironmentProvider
                                      └── ResponsiveProvider
                                            └── NetworkProvider
                                                  └── OfflineProvider
                                                        └── RuntimeBridge
                                                        └── SessionBridge
                                                        └── App
```

## Feature Flags

```typescript
import { createPercentageRolloutEvaluator } from '@larose/core';

const evaluator = createPercentageRolloutEvaluator({
  'new-payroll': { enabled: true, percentage: 25 },
});

<LaRoseProvider
  featureFlagEvaluator={evaluator}
  featureNames={['new-payroll']}
>
```

## Session Flow

```text
unauthenticated → authenticated → refreshing → authenticated
                              ↓
                    expired | revoked | unauthorized
```

`apiFetch` 401 → `larose:session-expired` → `SessionBridge` → runtime session `expired`

## Implementation Status (Phase 1)

- [x] Core runtime types and event bus
- [x] RuntimeContextProvider + RuntimeBridge
- [x] useRuntime / useSession / useRuntimeEvents
- [x] LaRoseProvider integration
- [x] Static + percentage feature flag evaluators
- [x] Accessibility preferences detection
- [x] Network states: fast, failed, recovering
- [x] Tenant resolver (theme + permissions + features bundle)
- [x] DevTools runtime context + timeline preview
