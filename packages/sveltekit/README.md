# @larose-ui/sveltekit

> SvelteKit helpers for SSR CSS and theme bootstrap.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Meta-framework

## Install

```bash
npm install @larose-ui/sveltekit
# or
pnpm add @larose-ui/sveltekit
# or
yarn add @larose-ui/sveltekit
```


**Peer dependency:** `@sveltejs/kit`


## Quick start

```tsx
import { createLaRoseThemeScriptContent, LAROSE_CSS_PATHS } from '@larose-ui/sveltekit';
```

## Features

- Theme script for `app.html`
- CSS path helpers for layouts

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
