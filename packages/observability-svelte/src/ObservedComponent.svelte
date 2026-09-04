<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { getObservabilityContext } from './context';

  interface Props {
    name: string;
    metadata?: Record<string, unknown>;
    children: Snippet;
  }

  let { name, metadata, children }: Props = $props();

  const { track } = getObservabilityContext();
  const start = performance.now();
  let warned = false;

  onMount(() => {
    const renderTimeMs = performance.now() - start;
    const threshold =
      renderTimeMs >= 50 ? 'critical' : renderTimeMs >= 16 ? 'slow' : 'ok';

    track({
      type: 'performance',
      component: name,
      metadata: { renderTimeMs, threshold, ...metadata },
    });

    if (threshold !== 'ok' && !warned) {
      warned = true;
      console.warn(
        `[laRose] Slow component: ${name} rendered in ${renderTimeMs.toFixed(1)}ms (${threshold})`,
      );
    }
  });
</script>

<div data-lr-observed={name}>
  {@render children()}
</div>
