<script lang="ts">
  import type { Snippet } from 'svelte';
  import type {
    ContextMenuEntry,
    ContextMenuItemConfig,
    ContextMenuPosition,
  } from '../../ContextMenu/types';
  import {
    canShowDisabledItem,
    isItem,
    isSubmenu,
    LONG_PRESS_MS,
    prepareContextMenuEntries,
    resolveMenuPosition,
    warnIfTooManyGroups,
  } from '../../ContextMenu/utils';
  import styles from '@larose-ui/styles/components/ContextMenu/ContextMenu.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';

  interface Props {
    children?: Snippet;
    entries: ContextMenuEntry[];
    title?: string;
    preview?: Snippet;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onEntrySelect?: (entry: ContextMenuItemConfig) => void;
    longPress?: boolean;
    dimBackground?: boolean;
    class?: string;
    style?: string;
  }

  let {
    children,
    entries,
    title,
    preview,
    open,
    onOpenChange,
    onEntrySelect,
    longPress = true,
    dimBackground = true,
    class: className,
    style,
  }: Props = $props();

  const menuId = $props.id();
  let internalOpen = $state(false);
  let position = $state<ContextMenuPosition>({ x: 0, y: 0, placement: 'below' });
  let activeSubmenu = $state<string | null>(null);
  let longPressTimer = $state<number | null>(null);
  const isOpen = $derived(open !== undefined ? open : internalOpen);
  const prepared = $derived(prepareContextMenuEntries(entries));

  $effect(() => {
    warnIfTooManyGroups(prepared);
  });

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
    if (!next) activeSubmenu = null;
  }

  function openAt(x: number, y: number) {
    const menuWidth = 240;
    const menuHeight = Math.min(360, 48 + prepared.length * 36 + (preview ? 120 : 0));
    position = resolveMenuPosition(x, y, menuWidth, menuHeight, window.innerWidth, window.innerHeight);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function handleSelect(entry: ContextMenuItemConfig) {
    entry.onSelect?.();
    onEntrySelect?.(entry);
    close();
  }

  function clearLongPress() {
    if (longPressTimer !== null) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    openAt(event.clientX, event.clientY);
  }

  function onPointerDown(event: PointerEvent) {
    if (!longPress || event.pointerType === 'mouse') return;
    clearLongPress();
    longPressTimer = window.setTimeout(() => openAt(event.clientX, event.clientY), LONG_PRESS_MS);
  }

  $effect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
</script>

<span
  class={cn(styles.triggerWrap, className)}
  {style}
  oncontextmenu={onContextMenu}
  onpointerdown={onPointerDown}
  onpointerup={clearLongPress}
  onpointercancel={clearLongPress}
  onpointerleave={clearLongPress}
>
  {@render children?.()}
</span>

{#if isOpen}
  <div use:portal>
    {#if dimBackground}
      <div class={styles.menuBackdrop} role="presentation" onclick={close}></div>
    {/if}
    <div
      id={menuId}
      class={styles.menu}
      role="menu"
      aria-label={title ?? 'Context menu'}
      style={`left:${position.x}px;top:${position.y}px;position:fixed;z-index:1000`}
      onclick={(e) => e.stopPropagation()}
    >
      {#if title}<p class={styles.title}>{title}</p>{/if}
      {#if preview}
        <div class={styles.preview}>{@render preview()}</div>
      {/if}
      <ul class={styles.list}>
        {#each prepared as entry, index ('id' in entry && entry.id ? entry.id : `sep-${index}`)}
          {#if entry.type === 'separator'}
            <li class={styles.separator} role="separator"></li>
          {:else if isSubmenu(entry)}
            <li class={styles.submenuWrap}>
              <button
                type="button"
                class={styles.submenuTrigger}
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={activeSubmenu === entry.id}
                onmouseenter={() => (activeSubmenu = entry.id)}
                onfocus={() => (activeSubmenu = entry.id)}
              >
                <span class={styles.label}>{entry.label}</span>
                <span class={styles.submenuChevron} aria-hidden="true">›</span>
              </button>
              {#if activeSubmenu === entry.id}
                <ul class={styles.submenu} role="menu" aria-label={entry.label}>
                  {#each entry.items as item (item.id)}
                    {@const disabled = Boolean(item.disabled && canShowDisabledItem(item))}
                    <li>
                      <button
                        type="button"
                        class={styles.item}
                        role="menuitem"
                        data-destructive={item.destructive ? 'true' : undefined}
                        {disabled}
                        onclick={() => {
                          if (disabled) return;
                          handleSelect(item);
                        }}
                      >
                        <span class={styles.label}>{item.label}</span>
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {:else if isItem(entry)}
            {@const disabled = Boolean(entry.disabled && canShowDisabledItem(entry))}
            <li>
              <button
                type="button"
                class={styles.item}
                role="menuitem"
                data-destructive={entry.destructive ? 'true' : undefined}
                {disabled}
                onclick={() => {
                  if (disabled) return;
                  handleSelect(entry);
                }}
              >
                <span class={styles.label}>{entry.label}</span>
              </button>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}
