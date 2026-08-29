# Observability 2.0 (Phase 3)

UX Intelligence correlating User → Session → Page → Component → Interaction → Network → API → Error → Performance → Outcome.

## Current State

- Event collector with adapters (console, Sentry, webhook)
- Form funnels, rage click detection, performance warnings
- **User journey trajectory** — chronological steps from UI + runtime events
- **Runtime correlation** — `RuntimeObservabilityBridge` ingests runtime bus + API lifecycle
- **Rage click root-cause linking** — correlates recent errors, dead buttons, network/API failures
- **Funnel correlation** — drop-off signals tied to validation, errors, network degradation
- DevTools **Journey** tab for live trajectory + rage-click analysis

## Integration

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { useJourneyPage } from '@larose-ui/observability';

function EmployeesPage() {
  useJourneyPage('employees');
  return <div>...</div>;
}

<LaRoseProvider observabilityDebug>
  <EmployeesPage />
</LaRoseProvider>
```

`LaRoseProvider` mounts `RuntimeObservabilityBridge` automatically. `apiFetch` dispatches `larose:api-request` / `larose:api-response` for correlation.

## API

| Export | Purpose |
|--------|---------|
| `useJourneyPage(name)` | Record page view in journey |
| `collector.getJourney(limit?)` | Recent journey steps |
| `collector.getRageClickAnalyses()` | Root-cause hints for rage clicks |
| `collector.getCorrelatedFormFunnel(form)` | Funnel metrics + drop-off signals |
| `analyzeRageClick()` | Pure function for custom pipelines |
| `ingestRuntimeEvent()` | Manual runtime event ingestion |
