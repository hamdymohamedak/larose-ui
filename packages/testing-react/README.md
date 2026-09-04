# @larose-ui/testing-react

> Test utilities with full laRose runtime context.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/testing-react
# or
pnpm add @larose-ui/testing-react
# or
yarn add @larose-ui/testing-react
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { renderWithLaRose } from '@larose-ui/testing-react';

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
| Runtime | `@larose-ui/runtime-react`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data-react`, `@larose-ui/forms-react`, `@larose-ui/permissions-react` |
| Platform | `@larose-ui/observability-react`, `@larose-ui/enterprise-react`, `@larose-ui/ai-react` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
