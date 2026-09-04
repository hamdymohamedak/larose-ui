<script lang="ts">
  import Menu from '../Menu/Menu.svelte';
  import DocumentMenuIcon from './DocumentMenuIcon.svelte';
  import { prepareMenuEntries } from '../../Menu/utils';
  import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    entries,
    label = 'Document',
    onAction,
    disabled,
  }: { entries: MenuEntry[]; label?: string; onAction?: (entryId: string) => void; disabled?: boolean } = $props();

  const prepared = $derived(prepareMenuEntries(entries));
</script>

<Menu entries={prepared} layout="large" dimBackground={false} onEntrySelect={(entry: MenuItemConfig) => onAction?.(entry.id)}>
  {#snippet children()}
    <button type="button" class={styles.item} aria-label={label} {disabled}>
      <span class={styles.itemIcon}><DocumentMenuIcon /></span>
    </button>
  {/snippet}
</Menu>
