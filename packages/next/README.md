# @larose-ui/next

> Next.js integration — SSR CSS and theme bootstrap without FOUC.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Meta-framework

## Install

```bash
npm install @larose-ui/next
# or
pnpm add @larose-ui/next
# or
yarn add @larose-ui/next
```


**Peer dependency:** `next >=14, react >=18`


## Quick start

```tsx
import { LaRoseRoot } from '@larose-ui/next/client';
import { LAROSE_CSS_IMPORTS } from '@larose-ui/next';
```

## Features

- SSR-safe CSS import list
- Early theme script
- Client root helpers

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
