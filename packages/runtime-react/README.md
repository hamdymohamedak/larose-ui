# @larose-ui/runtime-react

> App runtime for React — theme, i18n, network, offline, session.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Runtime

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
import { LaRoseProvider, useRuntime } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>
```

## Features

- `LaRoseProvider` composes runtime contexts
- `useRuntime()`, `useTheme()`, `useNetwork()`, `useOffline()`
- Toast subpath: `@larose-ui/runtime-react/toast`

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
