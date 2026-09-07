# @larose-ui/runtime-vue

> App runtime for Vue 3 — theme, i18n, network, offline, session.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Runtime

## Install

```bash
npm install @larose-ui/runtime-vue
# or
pnpm add @larose-ui/runtime-vue
# or
yarn add @larose-ui/runtime-vue
```


**Peer dependency:** `vue >=3`


## Quick start

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-vue';
```

## Features

- `LaRoseProvider` + provide/inject runtime context
- Network / offline / toast helpers

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
