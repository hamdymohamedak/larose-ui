# Svelte 5

# Svelte Integration

`@larose-ui/svelte` provides Svelte 5 bindings over the shared laRose platform.

```text
@larose-ui/core → tokens → styles → themes → primitives → runtime-core
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

```svelte
<script lang="ts">
  import { LaRoseProvider, RuntimeProvider } from '@larose-ui/svelte';
</script>

<LaRoseProvider>
  <RuntimeProvider initialContext={{ locale: 'en' }}>
    {@render children()}
  </RuntimeProvider>
</LaRoseProvider>
```

Use `getRuntimeContext()` in child components to read or patch runtime state.

## Components

Foundation set (mirrors `@larose-ui/vue`):

Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Label, Spinner, Progress, Alert, Card, Modal, Dialog, FieldShell

## Bindings

Form controls use `$bindable` props:

```svelte
<script lang="ts">
  let email = $state('');
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
