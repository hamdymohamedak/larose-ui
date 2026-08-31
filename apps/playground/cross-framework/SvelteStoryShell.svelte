<script lang="ts">
  import { createRawSnippet } from 'svelte';
  import type { Component, Snippet } from 'svelte';
  import LaRoseProvider from '../../../packages/svelte/src/lib/provider/LaRoseProvider.svelte';
  import * as components from './svelteComponents';

  interface Props {
    componentName: keyof typeof components;
    componentProps?: Record<string, unknown>;
    slotText?: string;
    theme?: 'light' | 'dark';
    density?: 'compact' | 'comfortable' | 'spacious';
  }

  let {
    componentName,
    componentProps = {},
    slotText,
    theme = 'light',
    density = 'comfortable',
  }: Props = $props();

  const ResolvedComponent = $derived(components[componentName] as Component);

  const textSnippet: Snippet | undefined = $derived(
    slotText
      ? createRawSnippet(() => ({
          render: () => slotText,
        }))
      : undefined,
  );
</script>

<LaRoseProvider {theme} {density}>
  {#if textSnippet}
    <ResolvedComponent {...componentProps} children={textSnippet} />
  {:else}
    <ResolvedComponent {...componentProps} />
  {/if}
</LaRoseProvider>
