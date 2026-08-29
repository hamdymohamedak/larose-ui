# @larose-ui/testing

> Test utilities with full laRose runtime context.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/testing
# or
pnpm add @larose-ui/testing
# or
yarn add @larose-ui/testing
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { renderWithLaRose } from '@larose-ui/testing';

renderWithLaRose(<EmployeeTable />, {
  permissions: ['employees.read'],
  theme: 'dark',
});
```

## Features

- `renderWithLaRose()` wraps components in `LaRoseProvider`
- Default test matrix scenarios (RTL, unauthorized, mobile)

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
