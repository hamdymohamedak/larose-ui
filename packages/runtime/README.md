# @larose-ui/runtime

> Unified runtime — theme, i18n, permissions, network, and session.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/runtime
# or
pnpm add @larose-ui/runtime
# or
yarn add @larose-ui/runtime
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { LaRoseProvider, useRuntime, Feature } from '@larose-ui/runtime';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>
```

## Features

- `LaRoseProvider` composes all runtime contexts
- `useRuntime()`, `useSession()`, `useTheme()`, `useNetwork()`
- Feature flags, tenant resolver, AdaptiveTable
- Toast subpath: `@larose-ui/runtime/toast`

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions` |
| Platform | `@larose-ui/observability`, `@larose-ui/enterprise`, `@larose-ui/ai` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/runtime/RUNTIME_2.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
