<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { createRuntimeStore } from '@larose-ui/runtime-core';
  import type { LaRoseRuntimeContext, RuntimeEvent, SessionState } from '@larose-ui/core';
  import { setRuntimeContext, type RuntimeContextValue } from '../runtime/context';
  import type { RuntimeProviderProps } from '../types';

  let { initialContext, onEvent, children }: RuntimeProviderProps = $props();

  const store = createRuntimeStore({ initialContext });
  let context = $state(store.getContext());

  const runtimeValue: RuntimeContextValue = {
    get context() {
      return context;
    },
    store,
    setContext(patch: Partial<LaRoseRuntimeContext>) {
      store.setContext(patch);
    },
    setSession(session: SessionState) {
      store.setSession(session);
    },
  };

  setRuntimeContext(runtimeValue);

  onMount(() => {
    const unsubscribe = store.subscribe(() => {
      context = store.getContext();
    });
    const unbindA11y = store.bindA11yPreferences();
    const unsubscribeEvents = onEvent ? store.eventBus.subscribe(onEvent) : undefined;
    return () => {
      unsubscribe();
      unbindA11y();
      unsubscribeEvents?.();
    };
  });
</script>

{@render children()}
