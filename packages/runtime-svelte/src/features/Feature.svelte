<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getFeature } from './context';

  interface Props {
    name: string;
    children?: Snippet;
    fallback?: Snippet;
  }

  let { name, children, fallback }: Props = $props();
  const state = getFeature(name);
</script>

{#if state.loading}
  <span aria-busy="true" data-feature={name}></span>
{:else if state.enabled}
  {@render children?.()}
{:else}
  {@render fallback?.()}
{/if}
