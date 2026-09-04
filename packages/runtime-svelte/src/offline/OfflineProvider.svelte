<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import type { OfflineQueue } from '@larose-ui/offline';
  import { createOfflineStore, setOfflineContext } from './context';

  interface Props {
    queue?: OfflineQueue;
    scopeId?: string;
    children?: Snippet;
  }

  let { queue, scopeId, children }: Props = $props();
  const offline = createOfflineStore({ queue, scopeId });
  setOfflineContext(offline.store);
  onMount(() => offline.mount());
  onDestroy(() => offline.destroy());
</script>

{@render children?.()}
