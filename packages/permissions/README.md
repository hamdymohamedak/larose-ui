# @larose-ui/permissions

> Authorization-aware UI with RBAC/ABAC patterns.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/permissions
# or
pnpm add @larose-ui/permissions
# or
yarn add @larose-ui/permissions
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { Can } from '@larose-ui/permissions';

<Can permission="employees.delete" fallback="disabled">
  <DeleteButton />
</Can>
```

## Features

- `<Can>` and `<Permission>` components
- Hidden, disabled, forbidden, and readonly fallbacks
- `<Explainable>` — show why an action is blocked

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
