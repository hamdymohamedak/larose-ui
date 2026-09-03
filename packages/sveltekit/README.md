# @larose-ui/sveltekit

SvelteKit helpers mirroring `@larose-ui/next` / `@larose-ui/nuxt`.

```ts
import {
  createLaRoseThemeScriptContent,
  LAROSE_CSS_PATHS,
  resolveLaRoseKitConfig,
} from '@larose-ui/sveltekit';
```

1. Import CSS from `LAROSE_CSS_PATHS` in `src/routes/+layout.svelte`.
2. Inject `createLaRoseThemeScriptContent()` into `src/app.html` before `%sveltekit.head%`.
3. Wrap with `LaRoseProvider` / `RuntimeProvider` from `@larose-ui/svelte` or `@larose-ui/runtime-svelte`.
