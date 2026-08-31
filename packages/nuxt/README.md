# @larose-ui/nuxt

Nuxt module for laRose UI. Components live in `@larose-ui/vue`.

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@larose-ui/nuxt'],
  laRose: {
    theme: 'light',
    appearance: 'system',
    runtime: { locale: 'en' },
  },
});
```

```vue
<!-- app.vue -->
<template>
  <LaRoseApp>
    <NuxtPage />
  </LaRoseApp>
</template>
```

See [docs/ecosystem/NUXT.md](../../docs/ecosystem/NUXT.md).
