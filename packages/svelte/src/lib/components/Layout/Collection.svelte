<script lang="ts">
  import styles from '@larose-ui/styles/components/Layout/Layout.module.css';
  import { cn } from '../../utils/cn';
  import type { CollectionItem, CollectionLayout } from '../../Layout/types';

  interface Props {
    items: CollectionItem[];
    layout?: CollectionLayout;
    class?: string;
    style?: string;
    ariaLabel?: string;
  }

  let {
    items,
    layout = 'grid',
    class: className,
    style,
    ariaLabel = 'Collection',
  }: Props = $props();
</script>

<div class={cn(styles.collection, className)} {style} data-layout={layout} role="list" aria-label={ariaLabel}>
  {#each items as item (item.id)}
    <div class={styles.item} role="listitem">
      {#if item.imageUrl}
        <img src={item.imageUrl} alt={item.label ?? ''} class={styles.itemImage} />
      {/if}
      {#if item.label}<span class={styles.itemLabel}>{item.label}</span>{/if}
    </div>
  {/each}
</div>
