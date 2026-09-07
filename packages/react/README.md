# @larose-ui/react

> Production-ready React components with built-in UI states.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** UI

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
import '@larose-ui/react/styles.css';

<Card title="Profile">
  <Input label="Email" />
  <Button variant="primary">Save</Button>
</Card>
```

## Features

- Form controls, overlays, navigation, data display
- Loading, error, empty, and disabled states
- Token-driven styling via CSS variables
- Styles entry: `@larose-ui/react/styles.css`

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
