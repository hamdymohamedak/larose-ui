# @larose-ui/observability-react

> UX observability for React — journeys, funnels, rage clicks.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Features

## Install

```bash
npm install @larose-ui/observability-react
# or
pnpm add @larose-ui/observability-react
# or
yarn add @larose-ui/observability-react
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { ObservabilityProvider, useTrackEvent } from '@larose-ui/observability-react';
```

## Features

- Journey tracking
- Form funnel metrics
- Sentry / webhook adapters

## Recommended app stack

Install these first (example for React):

- `@larose-ui/runtime-react`
- `@larose-ui/react`
- `@larose-ui/data-react`
- `@larose-ui/forms-react`
- `@larose-ui/permissions-react`

Internal packages (`core`, `tokens`, `*-core`, …) are pulled in automatically — you usually do not need to depend on them directly.

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
