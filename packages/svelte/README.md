# @larose-ui/svelte

Svelte 5 components for laRose UI — thin adapter over shared styles and primitives.

## Setup

```ts
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
```

```svelte
<script lang="ts">
  import { LaRoseProvider, Button } from '@larose-ui/svelte';
</script>

<LaRoseProvider theme="light">
  <Button variant="primary">
    {#snippet children()}Save{/snippet}
  </Button>
</LaRoseProvider>
```

See [docs/ecosystem/SVELTE.md](../../docs/ecosystem/SVELTE.md).
