# @larose-ui/observability

> UX observability — journeys, funnels, and rage-click analysis.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/observability
# or
pnpm add @larose-ui/observability
# or
yarn add @larose-ui/observability
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { useJourneyPage, ObservedForm } from '@larose-ui/observability';

function Page() {
  useJourneyPage('employees');
  return <ObservedForm name="create-employee">{/* fields */}</ObservedForm>;
}
```

## Features

- User journey tracking and correlation
- Form funnel metrics and drop-off signals
- Rage click root-cause linking
- Sentry, webhook, and console adapters

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions` |
| Platform | `@larose-ui/observability`, `@larose-ui/enterprise`, `@larose-ui/ai` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/observability/OBSERVABILITY_2.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
