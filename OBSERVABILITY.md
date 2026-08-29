# laRose Observability

## Goal

> Turn the UI Kit into a UX Observability Platform.

Components should be observable in production without developers wiring analytics manually.

## What We Track

### UI Errors

- Uncaught render errors (error boundaries)
- Failed interactions (dead buttons, rage clicks)
- API failures surfaced in UI
- Validation failures

### Component Performance

- Render time per component
- Interaction-to-paint latency
- Slow component warnings (>16ms render)
- Bundle impact per route

### User Actions

- Form opened / field focused / submit clicked
- Navigation events
- Feature flag exposures
- Permission denials (UI-level)

### Form Funnel Metrics

| Metric | Description |
|--------|-------------|
| Open Rate | Form views / page views |
| Completion Rate | Successful submits / opens |
| Error Rate | Failed submits / attempts |
| Abandonment Rate | Opens without submit |
| Avg Completion Time | Open to success duration |

## API

```jsx
<ObservedForm name="employee-create">
  {/* form fields */}
</ObservedForm>

<ObservedComponent name="EmployeeTable" />
```

### Event Schema

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

## Architecture

```text
Component
    ↓
@larose/observability (event collector)
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
} from '@larose/observability';

const adapter = createCompositeAdapter(
  createConsoleAdapter(),
  createSentryAdapter({ environment: 'production' }),
  createWebhookAdapter('https://analytics.example.com/ui-events'),
);
```

## Development Diagnostics

In development mode, warnings appear in console:

```text
laRose WARNING
Component: EmployeeTable
Problem: Missing permission definition
Suggested fix: Define employees.read
```

## Performance Monitoring

```typescript
// Automatic in ObservedComponent
{
  component: 'DataTable',
  renderTime: 48, // ms
  rowCount: 500,
  threshold: 'ok' | 'slow' | 'critical'
}
```

## Error Recovery Tracking

Track retry behavior:

```text
error → retry clicked → success | abandoned
```

Measure self-healing effectiveness.

## Privacy

- No PII in default events
- Field values never logged
- Opt-in for detailed interaction tracking
- Tenant isolation in event payloads

## Phase Rollout

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 4a | Event emitter + ObservedForm | Done |
| 4b | Performance measurement | Done |
| 4c | Rage click / dead button detection | Done |
| 4d | Production adapters (Sentry, webhook) | Done — `createSentryAdapter`, `createWebhookAdapter` |

## Metrics Export

Support Prometheus-style counters and custom webhook batching for enterprise dashboards.
