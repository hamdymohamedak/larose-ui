# Vue 3

# Vue 3 Integration

`@larose-ui/vue` provides Vue 3 bindings over the same framework-agnostic platform as React:

```text
@larose-ui/core
@larose-ui/tokens
@larose-ui/styles
@larose-ui/primitives
@larose-ui/themes
@larose-ui/runtime-core
        ↓
@larose-ui/vue
```

Components reuse **shared CSS modules** from `@larose-ui/styles` — one visual language, no duplicated design system.

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

For tenant, locale, permissions, and runtime context:

```vue
<script setup lang="ts">
import { LaRoseProvider, RuntimeProvider } from '@larose-ui/vue';
</script>

<template>
  <LaRoseProvider>
    <RuntimeProvider :initial-context="{ locale: 'en' }">
      <RouterView />
    </RuntimeProvider>
  </LaRoseProvider>
</template>
```

Use `useRuntimeContext()` inside setup functions to read or patch runtime state.

## Initial component set

Foundation components available in v0.1.1:

- **Actions:** Button
- **Forms:** Input, Textarea, Select, Checkbox, Radio, Switch, FieldShell
- **Feedback:** Alert, Progress, Spinner, Badge, Label
- **Layout:** Card, Modal, Dialog

Menu, Tabs, Tooltip, and CommandPalette will follow the same adapter pattern using `@larose-ui/primitives`.

## v-model

Form controls support Vue `v-model` / `modelValue`:

```vue
<Input v-model="email" label="Email" />
<Switch v-model="enabled" label="Notifications" />
```

## Nuxt

Use `@larose-ui/nuxt` for SSR-specific wiring — CSS injection, theme bootstrap script, and `LaRoseApp` shell. See [NUXT.md](../ecosystem/NUXT.md).
