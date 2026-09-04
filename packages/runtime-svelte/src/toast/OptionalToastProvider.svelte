<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ToastProvider } from '@larose-ui/svelte';

  interface Props {
    enabled?: boolean;
    placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    children?: Snippet;
  }

  let {
    enabled = true,
    placement = 'bottom-right',
    children,
  }: Props = $props();
</script>

{#if enabled}
  <ToastProvider {placement}>
    {@render children?.()}
  </ToastProvider>
{:else}
  {@render children?.()}
{/if}
