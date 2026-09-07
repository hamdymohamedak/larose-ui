# @larose-ui/runtime-svelte

> App runtime for Svelte 5 — theme, i18n, network, offline, session.

**Docs:** [https://hamdymohamedak.github.io/larose-ui](https://hamdymohamedak.github.io/larose-ui/) · **Source:** [laRose UI](https://github.com/hamdymohamedak/larose-ui)

**Public API layer:** Runtime

## Install

```bash
npm install @larose-ui/runtime-svelte @larose-ui/svelte @larose-ui/styles
# or
pnpm add @larose-ui/runtime-svelte @larose-ui/svelte @larose-ui/styles
# or
yarn add @larose-ui/runtime-svelte @larose-ui/svelte @larose-ui/styles
```

**Peer dependency:** `svelte >=5`

## Quick start

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-svelte';
```

Styles: `@larose-ui/styles/styles.css` (design tokens are bundled — no separate `@larose-ui/tokens` CSS import).

## Features

- `LaRoseProvider` + context stores
- Network / offline / toast helpers

## Documentation

- [laRose UI Docs](https://hamdymohamedak.github.io/larose-ui/) — getting started, components, guides
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
