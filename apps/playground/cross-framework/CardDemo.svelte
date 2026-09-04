<script lang="ts">
  import { createRawSnippet } from 'svelte';
  import Card from '../../../packages/svelte/src/lib/components/Card/Card.svelte';
  import Button from '../../../packages/svelte/src/lib/components/Button/Button.svelte';

  interface Props {
    title?: string;
    description?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    bodyText?: string;
    footerLabel?: string;
  }

  let {
    title,
    description,
    padding = 'md',
    bodyText = 'Card body content',
    footerLabel,
  }: Props = $props();

  const bodySnippet = $derived(
    createRawSnippet(() => ({
      render: () => bodyText ?? '',
    })),
  );
</script>

{#if footerLabel}
  <Card {title} {description} {padding} children={bodySnippet}>
    {#snippet footer()}
      <Button size="sm">{footerLabel}</Button>
    {/snippet}
  </Card>
{:else}
  <Card {title} {description} {padding} children={bodySnippet} />
{/if}
