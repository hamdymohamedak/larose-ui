# @larose-ui/themes

> Named theme presets and tenant branding helpers.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Branding

## Install

```bash
npm install @larose-ui/themes
# or
pnpm add @larose-ui/themes
# or
yarn add @larose-ui/themes
```



## Quick start

```tsx
import { applyThemePreset, listThemePresets } from '@larose-ui/themes';

applyThemePreset(document.documentElement, 'ocean');
```

## Features

- Presets: default, ocean, forest, sunset, refined
- Runtime theme application
- Tenant branding helpers

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
