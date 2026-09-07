# @larose-ui/runtime-react

> App runtime for React — theme, i18n, network, offline, session.

**Docs:** [https://hamdymohamedak.github.io/larose-ui](https://hamdymohamedak.github.io/larose-ui/) · **Source:** [laRose UI](https://github.com/hamdymohamedak/larose-ui)

**Public API layer:** Runtime

## Install

```bash
npm install @larose-ui/runtime-react @larose-ui/react
# or
pnpm add @larose-ui/runtime-react @larose-ui/react
# or
yarn add @larose-ui/runtime-react @larose-ui/react
```

**Peer dependency:** `react >=18`

## Quick start

```tsx
import { LaRoseProvider, useRuntime } from '@larose-ui/runtime-react';

<LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
  <App />
</LaRoseProvider>
```

Styles: `@larose-ui/react/styles.css` (design tokens are bundled — no separate `@larose-ui/tokens` CSS import).

## Features

- `LaRoseProvider` composes runtime contexts
- `useRuntime()`, `useTheme()`, `useNetwork()`, `useOffline()`
- Toast subpath: `@larose-ui/runtime-react/toast`

## Documentation

- [laRose UI Docs](https://hamdymohamedak.github.io/larose-ui/) — getting started, components, guides
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
