<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import { defaultBreakpoints, type BreakpointConfig } from '@larose-ui/runtime-core';
  import { createResponsiveStore, setResponsiveContext } from './context';

  interface Props {
    breakpoints?: BreakpointConfig;
    children?: Snippet;
  }

  let { breakpoints = defaultBreakpoints, children }: Props = $props();

  const store = createResponsiveStore(breakpoints);
  setResponsiveContext(store);
  onDestroy(() => store.destroy());
</script>

{@render children?.()}
