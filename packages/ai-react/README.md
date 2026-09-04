# @larose-ui/ai-react

> Permission-bound AI for SmartTable and SmartForm.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/ai-react
# or
pnpm add @larose-ui/ai-react
# or
yarn add @larose-ui/ai-react
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { SmartTable, AIProvider, createHttpAdapter } from '@larose-ui/ai-react';

<AIProvider adapter={createHttpAdapter({ baseUrl: 'https://api.example.com' })}>
  <SmartTable readPermission="employees.read" data={rows} columns={columns} keyExtractor={(r) => r.id} />
</AIProvider>
```

## Features

- Natural-language table filtering
- Natural-language form population
- Every action gated by permissions
- HTTP adapter with mock fallback

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime-react`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data-react`, `@larose-ui/forms-react`, `@larose-ui/permissions-react` |
| Platform | `@larose-ui/observability-react`, `@larose-ui/enterprise-react`, `@larose-ui/ai-react` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ai/AI_RUNTIME.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
