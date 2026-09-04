# @larose-ui/runtime-react

> Unified runtime — theme, i18n, permissions, network, and session.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/runtime-react
# or
pnpm add @larose-ui/runtime-react
# or
yarn add @larose-ui/runtime-react
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { LaRoseProvider, useRuntime, Feature } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>
```

## Features

- `LaRoseProvider` composes all runtime contexts
- `useRuntime()`, `useSession()`, `useTheme()`, `useNetwork()`
- Feature flags, tenant resolver, AdaptiveTable
- Toast subpath: `@larose-ui/runtime-react/toast`

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime-react`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data-react`, `@larose-ui/forms-react`, `@larose-ui/permissions-react` |
| Platform | `@larose-ui/observability-react`, `@larose-ui/enterprise-react`, `@larose-ui/ai-react` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/runtime/RUNTIME_2.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
