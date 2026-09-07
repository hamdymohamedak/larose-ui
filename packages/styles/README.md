# @larose-ui/styles

> Design tokens + component CSS in one stylesheet.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Stylesheets

## Install

```bash
npm install @larose-ui/styles
# or
pnpm add @larose-ui/styles
# or
yarn add @larose-ui/styles
```



## Quick start

```tsx
import '@larose-ui/styles/styles.css';
```

## Features

- Bundles `--lr-*` tokens and component styles together
- One import for Vue / Svelte / meta-framework apps
- React apps can use `@larose-ui/react/styles.css` instead

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
