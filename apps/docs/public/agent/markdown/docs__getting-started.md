# Getting started

Install laRose UI packages and wrap your app with `LaRoseProvider`.

## Install

```bash
pnpm add @larose-ui/react @larose-ui/runtime-react
```

Design tokens ship inside `@larose-ui/react/styles.css` — you do **not** need a separate `@larose-ui/tokens` install for normal apps.

For Vue / Svelte, install `@larose-ui/styles` instead (same tokens + component CSS bundle).

## Minimal app

Import global styles once, then render components inside the provider:

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/react/styles.css';

export function App() {
  return (
    <LaRoseProvider theme="light" density="comfortable">
      <Card title="Hello laRose">
        <Input label="Name" placeholder="Your name" />
        <Button>Save</Button>
      </Card>
    </LaRoseProvider>
  );
}
```

## Runtime stack

For production SaaS apps, use the full runtime provider:

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/react/styles.css';

<LaRoseProvider
  theme="light"
  locale="en"
  permissions={['app.read']}
  tenantId="acme"
>
  <Card title="Dashboard">
    <Button>Continue</Button>
  </Card>
</LaRoseProvider>
```

## Liquid glass (`@larose-ui/react`)

For displacement-mapped refraction surfaces — tab bars, top bars, buttons, switches, and more — import the LiquidGlass family from `@larose-ui/react`. Styles are already included in `react/styles.css`.

## Next steps

- Browse [Components](/docs/components) for live previews
- Open [Packages](/docs/packages) for every starter stack
- Read the [Public API](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md) surface guide
