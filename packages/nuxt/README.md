# @larose-ui/nuxt

> Nuxt module — CSS injection, theme script, and auto-imports.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Meta-framework

## Install

```bash
npm install @larose-ui/nuxt
# or
pnpm add @larose-ui/nuxt
# or
yarn add @larose-ui/nuxt
```


**Peer dependency:** `nuxt >=3`


## Quick start

```tsx
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@larose-ui/nuxt'],
})
```

## Features

- Nuxt module with CSS + theme bootstrap
- Auto-imports from runtime-vue

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
