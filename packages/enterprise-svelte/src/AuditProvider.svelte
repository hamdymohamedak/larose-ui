<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { createAuditContext, setAuditContext } from './context';

  interface Props {
    actor?: string;
    children: Snippet;
  }

  let { actor = 'system', children }: Props = $props();

  const store = untrack(() => createAuditContext(actor));
  setAuditContext(store);

  $effect(() => {
    store.setActor(actor);
  });
</script>

{@render children()}
