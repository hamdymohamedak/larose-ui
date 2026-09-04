# Vue 3 Integration

`@larose-ui/vue` provides Vue 3 bindings over the same framework-agnostic platform as React:

```text
@larose-ui/core
@larose-ui/tokens
@larose-ui/styles
@larose-ui/primitives
@larose-ui/component-logic
@larose-ui/liquid-glass-core
@larose-ui/themes
@larose-ui/runtime-core
        ↓
@larose-ui/vue
```

Components reuse **shared CSS modules** from `@larose-ui/styles`, shared utils from `@larose-ui/component-logic`, and interaction helpers from `@larose-ui/primitives` — one visual language, no duplicated design system logic.

## Install

```bash
pnpm add @larose-ui/vue @larose-ui/tokens
```

## Setup

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';

createApp(App).mount('#app');
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { LaRoseProvider, Button } from '@larose-ui/vue';
</script>

<template>
  <LaRoseProvider theme="light">
    <Button variant="primary">Save</Button>
  </LaRoseProvider>
</template>
```

## Runtime

For the full platform stack (theme, toast, accelerator, i18n, permissions, network, offline):

```vue
<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import { Button } from '@larose-ui/vue';
</script>

<template>
  <LaRoseProvider theme="light" appearance="system" locale="en">
    <Button variant="primary">Save</Button>
  </LaRoseProvider>
</template>
```

Theme-only apps can keep using `LaRoseProvider` from `@larose-ui/vue`. Use `useRuntimeContext()` from `@larose-ui/runtime-vue` inside setup to read or patch runtime state.

## Components

The Vue package mirrors the React component surface, including:

- **Actions:** Button, ButtonGroup, AsyncButton, HelpButton, SquareButton
- **Forms / data entry:** Input, Textarea, Select, Checkbox, Radio, Switch, FieldShell, SecureField, TokenField, …
- **Feedback:** Alert, AlertDialog, Progress, Spinner, Badge, Label, Toast
- **Navigation / chrome:** Tabs, TabView, Sidebar, Toolbar, Menu, MenuBar, ContextMenu, Breadcrumb
- **Overlays:** Modal, Dialog, Drawer, Popover, CommandPalette
- **Layout / data display:** Card, SplitView, List / Table, Chart, Disclosure, …
- **Liquid Glass:** `LiquidGlass`, `LiquidGlassButton`, TabBar, TopBar, and related controls

Shared behavior (menus, focus trap helpers, domain utils) lives in `@larose-ui/primitives` and `@larose-ui/component-logic`. Vue adapters focus on rendering and Vue idioms (`v-model`, slots).

> **Intelligence adapters:** Schema/client/authz logic lives in `*-core` packages. Vue UI adapters:
>
> - `@larose-ui/forms-vue` — schema-driven `Form`
> - `@larose-ui/data-vue` — `useQuery`, `useMutation`, `DataView`
> - `@larose-ui/permissions-vue` — `PermissionProvider`, `Can`, `Permission`
> - `@larose-ui/observability-vue` — `ObservabilityProvider`, `ObservedForm`, `ObservedComponent`

## v-model

Form controls support Vue `v-model` / `modelValue`:

```vue
<Input v-model="email" label="Email" />
<Switch v-model="enabled" label="Notifications" />
```

## Nuxt

Use `@larose-ui/nuxt` for SSR-specific wiring — CSS injection, theme bootstrap script, and `LaRoseApp` shell. See [NUXT.md](../ecosystem/NUXT.md).
