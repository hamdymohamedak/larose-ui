# @larose-ui/core

> Framework-agnostic types, state machines, and runtime contracts.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/core
# or
pnpm add @larose-ui/core
# or
yarn add @larose-ui/core
```



## Quick start

```tsx
import { createAsyncStateMachine, classifyHttpError } from '@larose-ui/core';

const machine = createAsyncStateMachine();
machine.send({ type: 'START' });
```

## Features

- Shared TypeScript types (`UIState`, `AsyncState`, `Environment`)
- Async state machine factory
- HTTP error classification
- Runtime event bus and session state machine
- Feature flag evaluators

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions` |
| Platform | `@larose-ui/observability`, `@larose-ui/enterprise`, `@larose-ui/ai` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/runtime/RUNTIME_2.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
