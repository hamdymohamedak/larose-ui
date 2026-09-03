<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import type { LaRoseRuntimeContext, RuntimeEvent } from '@larose-ui/core';
  import { createRuntimeContext, setRuntimeContext } from './context';

  interface Props {
    initialContext?: Partial<LaRoseRuntimeContext>;
    onEvent?: (event: RuntimeEvent) => void;
    children?: Snippet;
  }

  let { initialContext, onEvent, children }: Props = $props();
  const runtime = createRuntimeContext(initialContext, onEvent);
  setRuntimeContext(runtime);
  onMount(() => runtime.mount());
  onDestroy(() => runtime.unmount());
</script>

{@render children?.()}
