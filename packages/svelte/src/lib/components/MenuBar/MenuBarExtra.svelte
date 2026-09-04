<script lang="ts">
  import type { Snippet } from 'svelte';
  import Menu from '../Menu/Menu.svelte';
  import { prepareMenuEntries } from '../../Menu/utils';
  import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
  import { resolveDynamicMenuEntries } from '../../MenuBar/utils';
  import styles from '@larose-ui/styles/components/MenuBar/MenuBar.module.css';
  import { cn } from '../../utils/cn';

  let {
    id,
    label,
    icon,
    entries,
    isOpen,
    onOpenChange,
    optionKey = false,
    mnemonicVisible = false,
    enableTypeAhead = true,
    enableMnemonics = true,
    onAction,
    class: className,
    style,
  }: {
    id: string;
    label: string;
    icon?: Snippet;
    entries: MenuEntry[];
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    optionKey?: boolean;
    mnemonicVisible?: boolean;
    enableTypeAhead?: boolean;
    enableMnemonics?: boolean;
    onAction?: (entry: MenuItemConfig) => void;
    class?: string;
    style?: string;
  } = $props();

  const prepared = $derived(
    resolveDynamicMenuEntries(prepareMenuEntries(entries), { optionKey }),
  );
</script>

<Menu
  entries={prepared}
  open={isOpen}
  {onOpenChange}
  dimBackground={false}
  layout="large"
  onEntrySelect={(entry) => onAction?.(entry)}
  {optionKey}
  {enableTypeAhead}
  {enableMnemonics}
  {mnemonicVisible}
  class={cn(className)}
  {style}
>
  <button type="button" class={styles.extraButton} aria-label={label} data-extra-id={id}>
    {#if icon}{@render icon()}{/if}
  </button>
</Menu>
