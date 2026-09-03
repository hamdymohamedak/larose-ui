# Getting started

Install laRose UI packages and wrap your app with `LaRoseProvider`.

## Install

```bash
pnpm add @larose-ui/react @larose-ui/tokens
```

For runtime features (network, offline, toasts, permissions):

```bash
pnpm add @larose-ui/runtime @larose-ui/permissions
```

## Minimal app

Import global styles once, then render components inside the provider:

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';
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
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

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

For displacement-mapped refraction surfaces — tab bars, top bars, switches, sliders, and custom shells:

```bash
pnpm add @larose-ui/react @larose-ui/tokens
```

```tsx
import {
  LiquidGlassTabBar,
  LiquidGlassButton,
  LiquidGlassSwitch,
} from '@larose-ui/react';

<LiquidGlassTabBar
  items={[
    { key: 'home', label: 'Home', icon: <HomeIcon /> },
    { key: 'search', label: 'Search', icon: <SearchIcon /> },
  ]}
  defaultActiveKey="home"
/>
```

Browse the **Glass** category under [Components](/docs/components) for the full LiquidGlass API.

## Next steps

- Read the [Customization](/docs/guides/customization) guide for theming
- Browse [Button](/docs/components/button), [LiquidGlassButton](/docs/components/liquid-glass-button), and [CommandPalette](/docs/components/command-palette) docs
- Open Storybook locally with `pnpm dev` from the monorepo root
