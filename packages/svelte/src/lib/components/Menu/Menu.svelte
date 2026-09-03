<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getAcceleratorContext, registerMenuAccelerator, createCombinedMenuKeyboard } from '../../accelerator/context';
  import { resolveMenuShortcut } from '../../accelerator/resolveMenuShortcut';
  import MnemonicLabel from '../Accelerator/MnemonicLabel.svelte';
  import type { MenuEntry, MenuItemConfig, MenuLayout, MenuPosition } from '../../Menu/types';
  import {
    isMenuItem,
    isMenuSubmenu,
    prepareMenuEntries,
    resolveMenuPanelPosition,
    splitCompactAndList,
  } from '../../Menu/utils';
  import styles from '@larose-ui/styles/components/Menu/Menu.module.css';

  let {
    children,
    entries,
    layout = 'large',
    title,
    open,
    onOpenChange,
    onEntrySelect,
    dimBackground = true,
    enableShortcuts = true,
    optionKey,
    enableTypeAhead = true,
    enableMnemonics = true,
    mnemonicVisible = false,
    class: className,
    style,
  }: {
    children?: Snippet;
    entries: MenuEntry[];
    layout?: MenuLayout;
    title?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onEntrySelect?: (entry: MenuItemConfig) => boolean | void;
    dimBackground?: boolean;
    enableShortcuts?: boolean;
    optionKey?: boolean;
    enableTypeAhead?: boolean;
    enableMnemonics?: boolean;
    mnemonicVisible?: boolean;
    class?: string;
    style?: string;
  } = $props();

  const menuId = $props.id();
  let triggerEl = $state<HTMLSpanElement | null>(null);
  let internalOpen = $state(false);
  let position = $state<MenuPosition>({ x: 0, y: 0, placement: 'below' });
  let activeSubmenu = $state<string | null>(null);
  let typeAheadHighlightId = $state<string | null>(null);
  const isOpen = $derived(open ?? internalOpen);
  const prepared = $derived(prepareMenuEntries(entries));
  const split = $derived(splitCompactAndList(prepared, layout));

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
    if (!next) activeSubmenu = null;
  }

  function estimateHeight() {
    return Math.min(420, 48 + prepared.length * 36 + (layout !== 'large' ? 64 : 0));
  }
  function estimateWidth() {
    return layout === 'large' ? 240 : 280;
  }

  function openFromTrigger() {
    const rect = triggerEl?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    position = resolveMenuPanelPosition(rect, estimateWidth(), estimateHeight());
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function handleSelect(entry: MenuItemConfig) {
    const shouldClose = onEntrySelect?.(entry) !== false;
    if (shouldClose) close();
  }

  $effect(() => {
    if (!isOpen) return;
    if (!children) {
      position = {
        x: Math.max(16, (window.innerWidth - estimateWidth()) / 2),
        y: Math.max(16, (window.innerHeight - estimateHeight()) / 2),
        placement: 'below',
      };
    }
  });

  $effect(() => {
    if (!isOpen || !enableShortcuts) return;
    const keyboard = createCombinedMenuKeyboard({
      entries: prepared,
      activeSubmenuId: activeSubmenu,
      optionKey,
      onSelect: handleSelect,
      onClose: close,
      enableTypeAhead,
      enableMnemonics,
      mnemonicActive: mnemonicVisible,
    });
    const unregister = registerMenuAccelerator(menuId, keyboard.handler, true);
    const ctx = getAcceleratorContext();
    const onKey = (event: KeyboardEvent) => {
      keyboard.handler(event);
      typeAheadHighlightId = keyboard.getTypeAheadHighlightId();
    };
    if (!ctx) document.addEventListener('keydown', onKey, true);
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onEsc);
    return () => {
      unregister();
      if (!ctx) document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('keydown', onEsc);
    };
  });
</script>

{#if children}
  <span bind:this={triggerEl} class={[styles.triggerWrap, className].filter(Boolean).join(' ')} {style} onclick={openFromTrigger}>
    {@render children()}
  </span>
{/if}

{#if isOpen}
  {#if dimBackground}
    <div class={styles.menuBackdrop} role="presentation" onclick={close}></div>
  {/if}
  <div
    id={menuId}
    class={styles.menu}
    role="menu"
    aria-label="Menu"
    style={`position:fixed;left:${position.x}px;top:${position.y}px;z-index:1000;${style ?? ''}`}
    onclick={(event) => event.stopPropagation()}
  >
    {#if title}<p class={styles.menuTitle}>{title}</p>{/if}
    {#if split.compact.length > 0}
      <div class={styles.compactRow} role="group" aria-label="Primary actions">
        {#each split.compact as item (item.id)}
          <button
            type="button"
            class={styles.compactTile}
            data-layout={layout}
            disabled={item.disabled}
            aria-label={layout === 'small' ? item.label : undefined}
            onclick={() => {
              if (item.disabled) return;
              item.onSelect?.();
              handleSelect(item);
            }}
          >
            {#if item.icon}<span class={styles.compactIcon}></span>{/if}
            {#if layout === 'medium'}<span class={styles.compactLabel}>{item.label}</span>{/if}
          </button>
        {/each}
      </div>
    {/if}
    <ul class={styles.list}>
      {#each split.list as entry, index (entry.type === 'separator' ? entry.id ?? `sep-${index}` : 'id' in entry ? entry.id : index)}
        {#if entry.type === 'separator'}
          <li class={styles.separator} role="separator"></li>
        {:else if isMenuSubmenu(entry)}
          {@const submenuResolved = resolveMenuShortcut(entry, { optionKey })}
          <li class={styles.submenuWrap} data-active={activeSubmenu === entry.id ? 'true' : undefined}>
            <button
              type="button"
              class={styles.submenuTrigger}
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={activeSubmenu === entry.id}
              disabled={entry.disabled}
              onmouseenter={() => (activeSubmenu = entry.id)}
              onfocus={() => (activeSubmenu = entry.id)}
            >
              <span class={styles.checkmark} aria-hidden="true"></span>
              {#if entry.icon}<span class={styles.icon}></span>{/if}
              <MnemonicLabel label={entry.label} showAccessKey={mnemonicVisible} class={styles.label} />
              {#if submenuResolved.display}
                <span class={styles.shortcut} dir="ltr">{submenuResolved.display}</span>
              {/if}
              <span class={styles.submenuChevron} aria-hidden="true">›</span>
            </button>
            {#if activeSubmenu === entry.id}
              <ul class={styles.submenu} role="menu" aria-label={entry.label} data-side="end">
                {#each entry.items as item (item.id)}
                  {@const resolved = resolveMenuShortcut(item, { optionKey })}
                  <li>
                    <button
                      type="button"
                      class={styles.item}
                      role="menuitem"
                      data-destructive={item.destructive ? 'true' : undefined}
                      data-typeahead-match={typeAheadHighlightId === item.id ? 'true' : undefined}
                      disabled={item.disabled}
                      aria-checked={item.selected ? true : undefined}
                      aria-keyshortcuts={resolved.ariaKeyshortcuts}
                      onclick={() => {
                        if (item.disabled) return;
                        item.onSelect?.();
                        handleSelect(item);
                      }}
                    >
                      <span class={styles.checkmark} aria-hidden="true">{item.selected ? '✓' : ''}</span>
                      {#if item.icon}<span class={styles.icon}></span>{/if}
                      <MnemonicLabel
                        label={item.label}
                        mnemonic={item.mnemonic}
                        showAccessKey={mnemonicVisible}
                        class={styles.label}
                      />
                      {#if resolved.display}<span class={styles.shortcut} dir="ltr">{resolved.display}</span>{/if}
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {:else if isMenuItem(entry)}
          {@const resolved = resolveMenuShortcut(entry, { optionKey })}
          <li>
            <button
              type="button"
              class={styles.item}
              role="menuitem"
              data-destructive={entry.destructive ? 'true' : undefined}
              data-typeahead-match={typeAheadHighlightId === entry.id ? 'true' : undefined}
              disabled={entry.disabled}
              aria-checked={entry.selected ? true : undefined}
              aria-keyshortcuts={resolved.ariaKeyshortcuts}
              onclick={() => {
                if (entry.disabled) return;
                entry.onSelect?.();
                handleSelect(entry);
              }}
            >
              <span class={styles.checkmark} aria-hidden="true">{entry.selected ? '✓' : ''}</span>
              {#if entry.icon}<span class={styles.icon}></span>{/if}
              <MnemonicLabel
                label={entry.label}
                mnemonic={entry.mnemonic}
                showAccessKey={mnemonicVisible}
                class={styles.label}
              />
              {#if resolved.display}<span class={styles.shortcut} dir="ltr">{resolved.display}</span>{/if}
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
{/if}
