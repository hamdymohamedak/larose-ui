<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import type { NetworkMonitor } from '@larose-ui/network';
  import { createNetworkStore, setNetworkContext } from './context';

  interface Props {
    monitor?: NetworkMonitor;
    children?: Snippet;
  }

  let { monitor, children }: Props = $props();
  const network = createNetworkStore(monitor);
  setNetworkContext(network.state, network.monitor);
  onMount(() => network.mount());
  onDestroy(() => network.destroy());
</script>

{@render children?.()}
