<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
  import { cn } from '../../utils/cn';
  import { formatRating } from '../../Lockup/utils';

  interface Props {
    title: string;
    rating?: number;
    reviewCount?: number;
    class?: string;
    style?: string;
    children?: Snippet;
  }

  let { title, rating, reviewCount, class: className, style, children }: Props = $props();
</script>

<article class={cn(styles.card, className)} {style}>
  <div class={styles.cardBody}>
    <h3 class={styles.headerTitle}>{title}</h3>
    {#if rating != null}<p class={styles.rating}>{formatRating(rating)}</p>{/if}
    {#if reviewCount != null}<p class={styles.review}>{reviewCount} reviews</p>{/if}
    {#if children}{@render children()}{/if}
  </div>
</article>
