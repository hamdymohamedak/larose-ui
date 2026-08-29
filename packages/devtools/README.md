# @larose-ui/devtools

> In-app runtime inspector for development.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/devtools
# or
pnpm add @larose-ui/devtools
# or
yarn add @larose-ui/devtools
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { DevToolsProvider } from '@larose-ui/devtools';

<LaRoseProvider>
  <DevToolsProvider />
  <App />
</LaRoseProvider>
```

## Features

- Runtime context panel (session, tenant, permissions)
- Event timeline from the runtime bus
- Component inspector with React fiber introspection
- Journey tab with rage-click analysis

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions` |
| Platform | `@larose-ui/observability`, `@larose-ui/enterprise`, `@larose-ui/ai` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/devtools/DEVTOOLS_2.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
