<script lang="ts">
  import Menu from '../Menu/Menu.svelte';
  import OverflowIcon from './OverflowIcon.svelte';
  import { prepareMenuEntries } from '../../Menu/utils';
  import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    entries,
    'aria-label': ariaLabel = 'More',
    onAction,
    disabled,
  }: { entries: MenuEntry[]; 'aria-label'?: string; onAction?: (entryId: string) => void; disabled?: boolean } =
    $props();

  const prepared = $derived(prepareMenuEntries(entries));
</script>

<div class={styles.moreWrap}>
  <Menu entries={prepared} layout="large" dimBackground={false} onEntrySelect={(entry: MenuItemConfig) => onAction?.(entry.id)}>
    {#snippet children()}
      <button type="button" aria-label={ariaLabel} {disabled}><OverflowIcon /></button>
    {/snippet}
  </Menu>
</div>
