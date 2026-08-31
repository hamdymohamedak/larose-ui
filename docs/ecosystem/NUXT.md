# Nuxt Integration

`@larose-ui/nuxt` is a thin Nuxt module over `@larose-ui/vue`. It does not duplicate components.

## Install

```bash
pnpm add @larose-ui/nuxt @larose-ui/vue
```

## Configure

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@larose-ui/nuxt'],
  laRose: {
    theme: 'light',
    density: 'comfortable',
    appearance: 'system',
    themeScript: true,
    css: true,
    runtime: { locale: 'en' },
  },
});
```

Module options (`laRose` key):

| Option | Default | Description |
|--------|---------|-------------|
| `css` | `true` | Adds tokens + shared component CSS |
| `themeScript` | `true` | Pre-hydration theme bootstrap script |
| `appearance` | `system` | `light` / `dark` / `system` for theme script |
| `theme` | `light` | Passed to `LaRoseProvider` |
| `density` | `comfortable` | UI density |
| `tenantId` | — | Optional tenant marker |
| `runtime` | `false` | `true` or initial context object for `RuntimeProvider` |
| `transpile` | `true` | Transpile `@larose-ui/vue` for SSR |

## App shell

Wrap your app once in `app.vue`:

```vue
<template>
  <LaRoseApp>
    <NuxtPage />
  </LaRoseApp>
</template>
```

`LaRoseApp` is auto-registered globally and reads `runtimeConfig.public.laRose`.

## Components

Import from `@larose-ui/vue` (auto-imports also register provider composables):

```vue
<script setup lang="ts">
import { Button, Input } from '@larose-ui/vue';

const email = ref('');
</script>

<template>
  <Input v-model="email" label="Email" />
  <Button variant="primary">Save</Button>
</template>
```

## SSR notes

1. Keep interactive laRose components in client-only islands when they rely on `window` (rare for foundation components).
2. The theme bootstrap script runs in `<head>` before Vue hydrates.
3. Permission checks remain UX-only — enforce authorization on the server.

See also [VUE.md](./VUE.md).
