<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { AbacContext } from '@larose-ui/permissions-core';
  import { createPermissionsContext, setPermissionsContext } from './context';

  interface Props {
    permissions?: string[];
    loading?: boolean;
    context?: AbacContext;
    children: Snippet;
  }

  let {
    permissions = [],
    loading = false,
    context = {},
    children,
  }: Props = $props();

  const store = createPermissionsContext({ permissions, loading, context });
  setPermissionsContext(store);

  $effect(() => {
    store.set({ permissions, loading, context });
  });
</script>

{@render children()}
