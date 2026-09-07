# @larose-ui/vue

> Vue 3 components with the same design system as React and Svelte.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** UI

## Install

```bash
npm install @larose-ui/vue
# or
pnpm add @larose-ui/vue
# or
yarn add @larose-ui/vue
```


**Peer dependency:** `vue >=3`


## Quick start

```tsx
import { Button, Card, Input } from '@larose-ui/vue';
import '@larose-ui/styles/styles.css';
```

## Features

- Parity components with React / Svelte
- Composables for toast and accelerators
- One CSS import: `@larose-ui/styles/styles.css` (tokens included)

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
