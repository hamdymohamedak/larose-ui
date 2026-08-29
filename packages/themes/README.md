# @larose-ui/themes

> Named theme presets and tenant branding helpers.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

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

- Built-in presets: default, ocean, forest, sunset
- Runtime theme application without rebuild
- Tenant branding integration

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions` |
| Platform | `@larose-ui/observability`, `@larose-ui/enterprise`, `@larose-ui/ai` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
