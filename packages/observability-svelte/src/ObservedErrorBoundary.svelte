<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getObservabilityContext } from './context';

  interface Props {
    name: string;
    fallback?: string;
    children: Snippet;
    failed?: Snippet<[Error, () => void]>;
  }

  let { name, fallback, children, failed }: Props = $props();

  const { track } = getObservabilityContext();

  function onerror(error: unknown, reset: () => void) {
    const caught = error instanceof Error ? error : new Error(String(error));
    track({
      type: 'error',
      component: name,
      metadata: {
        message: caught.message,
        stack: caught.stack,
      },
    });
    // reset available to failed snippet; keep signature for svelte:boundary
    void reset;
  }
</script>

<svelte:boundary {onerror}>
  {@render children()}

  {#snippet failed(error, reset)}
    {#if failed}
      {@render failed(error instanceof Error ? error : new Error(String(error)), reset)}
    {:else}
      <div role="alert" data-lr-error-boundary={name}>
        {fallback ?? `Something went wrong in ${name}.`}
      </div>
    {/if}
  {/snippet}
</svelte:boundary>
