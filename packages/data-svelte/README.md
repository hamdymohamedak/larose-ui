# @larose-ui/data-svelte

Svelte 5 adapter for `@larose-ui/data-core` — `createQuery`, `createMutation`, and `DataView`.

```svelte
<script>
  import { createQuery, DataView } from '@larose-ui/data-svelte';
  const query = createQuery(() => '/api/employees');
</script>

{#if $query.status === 'success'}
  <pre>{JSON.stringify($query.data)}</pre>
{/if}
```
