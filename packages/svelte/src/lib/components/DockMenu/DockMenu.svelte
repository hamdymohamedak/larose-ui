<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ContextMenuEntry, ContextMenuItemConfig } from '../../ContextMenu/types';
  import { canShowDisabledItem, isItem } from '../../ContextMenu/utils';
  import type { DockWindow } from '../../DockMenu/types';
  import { buildDockMenuEntries, resolveDockMenuPosition } from '../../DockMenu/utils';
  import styles from '@larose-ui/styles/components/DockMenu/DockMenu.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';

  let {
    appName,
    icon,
    isRunning = true,
    openWindows = [],
    runningEntries = [],
    closedEntries = [],
    onWindowSelect,
    onEntrySelect,
    open,
    onOpenChange,
    class: className,
    style,
  }: {
    appName: string;
    icon?: Snippet;
    isRunning?: boolean;
    openWindows?: DockWindow[];
    runningEntries?: ContextMenuEntry[];
    closedEntries?: ContextMenuEntry[];
    onWindowSelect?: (window: DockWindow) => void;
    onEntrySelect?: (entry: ContextMenuItemConfig) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    style?: string;
  } = $props();

  const menuId = $props.id();
  let iconEl = $state<HTMLButtonElement | null>(null);
  let internalOpen = $state(false);
  let position = $state({ x: 0, y: 0 });
  const isOpen = $derived(open ?? internalOpen);

  const preparedEntries = $derived(
    buildDockMenuEntries({
      isRunning,
      openWindows,
      runningEntries,
      closedEntries,
      onWindowSelect,
    }),
  );

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  }

  function openAboveIcon() {
    const rect = iconEl?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 240;
    const menuHeight = Math.min(360, 16 + preparedEntries.length * 36);
    position = resolveDockMenuPosition(rect, menuWidth, menuHeight);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function handleSelect(entry: ContextMenuItemConfig) {
    const disabled = Boolean(entry.disabled && canShowDisabledItem(entry));
    if (disabled) return;
    entry.onSelect?.();
    onEntrySelect?.(entry);
    close();
  }

  $effect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });
</script>

<button
  bind:this={iconEl}
  type="button"
  class={cn(styles.iconButton, className)}
  {style}
  aria-label={appName}
  aria-haspopup="menu"
  aria-expanded={isOpen}
  aria-controls={isOpen ? menuId : undefined}
  data-running={isRunning ? 'true' : undefined}
  data-active={isOpen ? 'true' : undefined}
  oncontextmenu={(event) => {
    event.preventDefault();
    openAboveIcon();
  }}
>
  <span class={styles.iconImage}>
    {#if icon}{@render icon()}{/if}
  </span>
</button>

{#if isOpen}
  <div use:portal>
    <div class={styles.menuBackdrop} role="presentation" onclick={close}></div>
    <div
      id={menuId}
      class={styles.menu}
      role="menu"
      aria-label={`${appName} Dock menu`}
      style={`position:fixed;left:${position.x}px;top:${position.y}px;z-index:1000;`}
      onclick={(event) => event.stopPropagation()}
    >
      <ul class={styles.list}>
        {#each preparedEntries as entry, index (entry.type === 'separator' ? `sep-${index}` : entry.id)}
          {#if entry.type === 'separator'}
            <li class={styles.separator} role="separator"></li>
          {:else if isItem(entry)}
            {@const disabled = Boolean(entry.disabled && canShowDisabledItem(entry))}
            <li>
              <button
                type="button"
                class={styles.item}
                role="menuitem"
                data-destructive={entry.destructive ? 'true' : undefined}
                {disabled}
                onclick={() => handleSelect(entry)}
              >
                {#if entry.icon}<span class={styles.icon}></span>{/if}
                <span class={styles.label}>{entry.label}</span>
              </button>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}
