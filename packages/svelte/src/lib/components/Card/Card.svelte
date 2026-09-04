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

  /** Match React: convenience props + snippets compose together; children-only = composition passthrough. */
  const usesConvenienceApi = $derived(
    Boolean(merged.title || merged.description || merged.body || merged.footer),
  );
</script>

<article class={cn(styles.card, merged.class)} style={merged.style} data-padding={merged.padding ?? 'md'}>
  {#if usesConvenienceApi}
    {#if merged.title || merged.description}
      <header class={styles.header}>
        {#if merged.title}<h3 class={styles.title}>{merged.title}</h3>{/if}
        {#if merged.description}<p class={styles.description}>{merged.description}</p>{/if}
      </header>
    {/if}
    {#if merged.children || merged.body}
      <div class={styles.body}>
        {#if merged.children}{@render merged.children()}{/if}
        {#if merged.body}{@render merged.body()}{/if}
      </div>
    {/if}
    {#if merged.footer}
      <footer class={styles.footer}>{@render merged.footer()}</footer>
    {/if}
  {:else if merged.children}
    {@render merged.children()}
  {/if}
</article>
