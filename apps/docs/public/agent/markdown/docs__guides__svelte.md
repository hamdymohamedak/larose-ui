# Svelte 5

# Svelte Integration

`@larose-ui/svelte` provides Svelte 5 bindings over the shared laRose platform.

```text
@larose-ui/core → tokens → styles → themes → primitives
→ component-logic → liquid-glass-core → runtime-core
                              ↓
                      @larose-ui/svelte
```

## Install

```bash
pnpm add @larose-ui/svelte @larose-ui/tokens
```

## Setup

```ts
// main.ts
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
```

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { LaRoseProvider, Button } from '@larose-ui/svelte';
</script>

<LaRoseProvider theme="light">
  <Button variant="primary">Save</Button>
</LaRoseProvider>
```

## Runtime

For the full platform stack (theme, toast, accelerator, i18n, permissions, network, offline):

```svelte
<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import { Button } from '@larose-ui/svelte';
</script>

<LaRoseProvider theme="light" appearance="system" locale="en">
  <Button variant="primary">Save</Button>
</LaRoseProvider>
```

Theme-only apps can keep using `LaRoseProvider` from `@larose-ui/svelte`. Use `getRuntimeContext()` from `@larose-ui/runtime-svelte` in child components to read or patch runtime state.

## Components

The Svelte package mirrors the React / Vue component surface (actions, forms, overlays, menus, toolbar, Liquid Glass, …). Shared logic comes from `@larose-ui/primitives`, `@larose-ui/component-logic`, and `@larose-ui/liquid-glass-core`.

Intelligence packages:

- Cores: `@larose-ui/forms-core` / `@larose-ui/data-core` / `@larose-ui/permissions-core` / `@larose-ui/observability-core`
- Svelte adapters: `@larose-ui/forms-svelte`, `@larose-ui/data-svelte`, `@larose-ui/permissions-svelte`, `@larose-ui/observability-svelte`
- React adapters remain available for React apps

## Bindings

Form controls use `$bindable` props:

```svelte
<script lang="ts">
  let email = $state('');
  let enabled = $state(false);
</script>

<Input bind:value={email} label="Email" />
<Switch bind:checked={enabled} label="Notifications" />
```

## Snippets

Pass content with Svelte 5 snippets:

```svelte
<Button variant="primary">
  {#snippet children()}Save{/snippet}
</Button>
```

Or as default slot content between tags when supported by your bundler.

See also [VUE.md](./VUE.md) for shared platform concepts.
