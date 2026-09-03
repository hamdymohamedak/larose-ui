<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy, onMount } from 'svelte';
  import { getObservabilityContext } from './context';

  interface Props {
    name: string;
    onAbandon?: () => void;
    children: Snippet;
  }

  let { name, onAbandon, children }: Props = $props();

  const { track, collector } = getObservabilityContext();
  let opened = false;
  let completed = false;
  let unsubscribe: (() => void) | undefined;

  onMount(() => {
    unsubscribe = collector.subscribe((event) => {
      if (
        event.component === name &&
        (event.type === 'form.submitted' || event.type === 'form.success')
      ) {
        completed = true;
      }
    });

    if (!opened) {
      opened = true;
      track({ type: 'form.opened', component: name });
    }
  });

  onDestroy(() => {
    unsubscribe?.();
    if (!completed) {
      track({ type: 'form.abandoned', component: name });
      onAbandon?.();
    }
  });

  function handleFocus(e: FocusEvent) {
    const target = e.target as HTMLElement | null;
    if (target?.matches?.('input, select, textarea')) {
      track({
        type: 'form.field_focused',
        component: name,
        metadata: { field: target.getAttribute('name') ?? undefined },
      });
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div data-lr-observed-form={name} onfocusin={handleFocus}>
  {@render children()}
</div>
