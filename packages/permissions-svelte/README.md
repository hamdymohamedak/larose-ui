# @larose-ui/permissions-svelte

Svelte 5 adapter for `@larose-ui/permissions-core` — `PermissionProvider`, `permissionStore`, `Can`, `Permission`.

```svelte
<script>
  import { PermissionProvider, Can } from '@larose-ui/permissions-svelte';
</script>

<PermissionProvider permissions={['employees.read']}>
  {#snippet children()}
    <Can permission="employees.read">{#snippet children()}Visible{/snippet}</Can>
  {/snippet}
</PermissionProvider>
```
