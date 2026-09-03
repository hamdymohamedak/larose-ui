<script lang="ts">
  import styles from '@larose-ui/styles/components/Pagination/Pagination.module.css';
  import { cn } from '../../utils/cn';
  import { getPageItems } from './pageItems';

  interface Props {
    page: number;
    totalPages: number;
    siblingCount?: number;
    previousLabel?: string;
    nextLabel?: string;
    class?: string;
    style?: string;
    ariaLabel?: string;
    onPageChange?: (page: number) => void;
  }

  let {
    page,
    totalPages,
    siblingCount = 1,
    previousLabel = 'Previous page',
    nextLabel = 'Next page',
    class: className,
    style,
    ariaLabel = 'Pagination',
    onPageChange,
  }: Props = $props();

  const items = $derived(getPageItems(page, totalPages, siblingCount));
</script>

{#if totalPages >= 1}
  <nav class={cn(styles.pagination, className)} {style} aria-label={ariaLabel}>
    <button
      type="button"
      class={styles.pageButton}
      disabled={page <= 1}
      aria-label={previousLabel}
      onclick={() => onPageChange?.(page - 1)}
    >
      ‹
    </button>
    {#each items as item, index (String(item) + index)}
      {#if item === 'ellipsis'}
        <span class={styles.ellipsis} aria-hidden="true">…</span>
      {:else}
        <button
          type="button"
          class={styles.pageButton}
          data-state={item === page ? 'active' : undefined}
          aria-current={item === page ? 'page' : undefined}
          onclick={() => onPageChange?.(item)}
        >
          {item}
        </button>
      {/if}
    {/each}
    <button
      type="button"
      class={styles.pageButton}
      disabled={page >= totalPages}
      aria-label={nextLabel}
      onclick={() => onPageChange?.(page + 1)}
    >
      ›
    </button>
  </nav>
{/if}
