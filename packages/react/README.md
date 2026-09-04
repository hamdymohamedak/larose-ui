# @larose-ui/react

> Production-ready React components with built-in UI states.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/react
# or
pnpm add @larose-ui/react
# or
yarn add @larose-ui/react
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { Button, Card, Input, Dialog } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

<Card title="Profile">
  <Input label="Email" />
  <Button variant="primary">Save</Button>
</Card>
```

## Features

- Form controls, overlays, navigation, data display
- Loading, error, empty, and disabled states
- Token-driven styling via CSS variables
- AsyncButton, DataTable, CommandPalette, and more

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
