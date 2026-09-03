<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Card/Card.module.css';
  import { cn } from '../../utils/cn';
  import { getComponentDefaults } from '../../theme/context';

  interface Props {
    title?: string;
    description?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    class?: string;
    style?: string;
    children?: Snippet;
    body?: Snippet;
    footer?: Snippet;
  }

  let props: Props = $props();
  const merged = $derived(getComponentDefaults('Card', props));
</script>

<article class={cn(styles.card, merged.class)} style={merged.style} data-padding={merged.padding ?? 'md'}>
  {#if merged.children}
    {@render merged.children()}
  {:else}
    {#if merged.title || merged.description}
      <header class={styles.header}>
        {#if merged.title}<h3 class={styles.title}>{merged.title}</h3>{/if}
        {#if merged.description}<p class={styles.description}>{merged.description}</p>{/if}
      </header>
    {/if}
    {#if merged.body}
      <div class={styles.body}>{@render merged.body()}</div>
    {/if}
    {#if merged.footer}
      <footer class={styles.footer}>{@render merged.footer()}</footer>
    {/if}
  {/if}
</article>
