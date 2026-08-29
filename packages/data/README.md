# @larose-ui/data

> Backend-aware data fetching with self-healing errors.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/data
# or
pnpm add @larose-ui/data
# or
yarn add @larose-ui/data
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { DataView } from '@larose-ui/data';

<DataView url="/api/employees" permission="employees.read">
  {(rows) => <EmployeeTable data={rows} />}
</DataView>
```

## Features

- `useQuery`, `useMutation`, `DataView`
- Self-healing errors with auto-retry on 429/5xx
- `useUndo` for destructive action recovery

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
