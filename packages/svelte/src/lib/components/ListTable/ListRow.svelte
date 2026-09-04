<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ListAccessory } from '../../ListTable/types';
  import { truncateMiddle } from '../../ListTable/utils';
  import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

  let {
    title,
    subtitle,
    leading,
    accessory = 'none',
    selected = false,
    disabled = false,
    truncate = 'end',
    onPress,
    onInfo,
    class: className,
    style,
  }: {
    title: string;
    subtitle?: string;
    leading?: Snippet;
    accessory?: ListAccessory;
    selected?: boolean;
    disabled?: boolean;
    truncate?: 'end' | 'middle';
    onPress?: () => void;
    onInfo?: (event: MouseEvent) => void;
    class?: string;
    style?: string;
  } = $props();

  const displayTitle = $derived(truncate === 'middle' ? truncateMiddle(title) : title);
</script>

<li>
  <button
    type="button"
    class={[styles.row, className].filter(Boolean).join(' ')}
    {style}
    data-selected={selected ? 'true' : undefined}
    {disabled}
    onclick={onPress}
  >
    {#if leading}<span class={styles.rowLeading}>{@render leading()}</span>{/if}
    <span class={styles.rowText}>
      <span class={styles.rowTitle} data-truncate={truncate}>{displayTitle}</span>
      {#if subtitle}<span class={styles.rowSubtitle}>{subtitle}</span>{/if}
    </span>
    {#if accessory === 'info'}
      <button
        type="button"
        class={styles.infoButton}
        aria-label={`More information about ${title}`}
        onclick={(event) => {
          event.stopPropagation();
          onInfo?.(event);
        }}>i</button
      >
    {:else if accessory !== 'none'}
      <span class={styles.rowAccessory} aria-hidden="true"
        >{accessory === 'disclosure' ? '›' : accessory === 'checkmark' ? '✓' : ''}</span
      >
    {/if}
  </button>
</li>
