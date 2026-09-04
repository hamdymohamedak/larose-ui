<script lang="ts">
  import Menu from '../../../packages/svelte/src/lib/components/Menu/Menu.svelte';
  import Button from '../../../packages/svelte/src/lib/components/Button/Button.svelte';
  import type { MenuEntry, MenuLayout } from '../../../packages/svelte/src/lib/Menu/types';

  let {
    open = true,
    title = 'Actions',
    layout = 'large' as MenuLayout,
    entries = [
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
      { type: 'separator' as const },
      { id: 'select-all', label: 'Select All' },
    ] as MenuEntry[],
    triggerLabel = 'Open menu',
    showTrigger = true,
  }: {
    open?: boolean;
    title?: string;
    layout?: MenuLayout;
    entries?: MenuEntry[];
    triggerLabel?: string;
    showTrigger?: boolean;
  } = $props();
</script>

<div style="min-height: 16rem; display: flex; align-items: center; justify-content: center">
  {#if showTrigger}
    <Menu {entries} {open} {title} {layout} onOpenChange={() => undefined}>
      {#snippet children()}
        <Button variant="secondary">{triggerLabel}</Button>
      {/snippet}
    </Menu>
  {:else}
    <Menu {entries} {open} {title} {layout} onOpenChange={() => undefined} />
  {/if}
</div>
