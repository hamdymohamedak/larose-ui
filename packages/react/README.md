# @larose-ui/react

> Production-ready React components with built-in UI states.

**Docs:** [https://hamdymohamedak.github.io/larose-ui](https://hamdymohamedak.github.io/larose-ui/) · **Source:** [laRose UI](https://github.com/hamdymohamedak/larose-ui)

**Public API layer:** UI

## Install

```bash
npm install @larose-ui/runtime-react @larose-ui/react
# or
pnpm add @larose-ui/runtime-react @larose-ui/react
# or
yarn add @larose-ui/runtime-react @larose-ui/react
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

Styles: `@larose-ui/react/styles.css` (design tokens are bundled — no separate `@larose-ui/tokens` CSS import).

## Features

- Form controls, overlays, navigation, data display
- Loading, error, empty, and disabled states
- Token-driven styling via CSS variables
- Styles entry: `@larose-ui/react/styles.css`

## Documentation

- [laRose UI Docs](https://hamdymohamedak.github.io/larose-ui/) — getting started, components, guides
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
