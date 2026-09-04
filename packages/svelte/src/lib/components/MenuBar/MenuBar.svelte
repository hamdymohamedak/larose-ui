<script lang="ts">
  import { detectPlatform } from '@larose-ui/core';
  import type { Snippet } from 'svelte';
  import Menu from '../Menu/Menu.svelte';
  import MnemonicLabel from '../Accelerator/MnemonicLabel.svelte';
  import { prepareMenuEntries } from '../../Menu/utils';
  import type { MenuItemConfig } from '../../Menu/types';
  import { registerMenuBarAccelerators } from '../../accelerator/context';
  import { collectMenuBarMnemonicBindings as collectMnemonics } from '../../accelerator/mnemonic';
  import MenuBarExtra from './MenuBarExtra.svelte';
  import type {
    MenuBarExtraConfig,
    MenuBarMenuConfig,
    MenuBarPlatform,
    StandardMenuBarOptions,
  } from '../../MenuBar/types';
  import {
    buildStandardMenuBar,
    createAppleMenuStub,
    resolveDynamicMenuEntries,
  } from '../../MenuBar/utils';
  import styles from '@larose-ui/styles/components/MenuBar/MenuBar.module.css';
  import { cn } from '../../utils/cn';

  let {
    appName,
    menus: menusProp,
    standardOptions,
    appSpecificMenus = [],
    extras = [],
    platform = 'macos',
    revealed,
    onRevealChange,
    showAppleMenu = platform === 'macos',
    class: className,
    style,
    onMenuAction,
    enableGlobalShortcuts = true,
    enableTypeAhead = true,
    enableMnemonics,
  }: {
    appName: string;
    menus?: MenuBarMenuConfig[];
    standardOptions?: StandardMenuBarOptions;
    appSpecificMenus?: MenuBarMenuConfig[];
    extras?: MenuBarExtraConfig[];
    platform?: MenuBarPlatform;
    revealed?: boolean;
    onRevealChange?: (revealed: boolean) => void;
    showAppleMenu?: boolean;
    class?: string;
    style?: string;
    onMenuAction?: (menuId: string, entryId: string) => void;
    enableGlobalShortcuts?: boolean;
    enableTypeAhead?: boolean;
    enableMnemonics?: boolean;
  } = $props();

  let openMenuId = $state<string | null>(null);
  let optionKey = $state(false);
  let altKeyHeld = $state(false);
  let internalRevealed = $state(platform !== 'ipados');
  const runtimePlatform = detectPlatform();
  const mnemonicsEnabled = $derived(enableMnemonics ?? runtimePlatform !== 'macos');
  const mnemonicVisible = $derived(
    mnemonicsEnabled && altKeyHeld && runtimePlatform !== 'macos',
  );
  const isRevealed = $derived(revealed ?? internalRevealed);

  const menus = $derived(
    menusProp ??
      buildStandardMenuBar({
        appName,
        platform,
        appSpecificMenus,
        ...standardOptions,
      }),
  );

  const allMenus = $derived.by(() => {
    const list = [...menus];
    if (showAppleMenu && platform === 'macos') {
      list.unshift({
        id: 'apple',
        title: 'Apple',
        ariaLabel: 'Apple menu',
        entries: createAppleMenuStub(),
      });
    }
    return list;
  });

  const appleMenu: MenuBarMenuConfig = {
    id: 'apple',
    title: 'Apple',
    ariaLabel: 'Apple menu',
    entries: createAppleMenuStub(),
  };

  const menuBarMnemonics = $derived(collectMnemonics(allMenus));

  $effect(() => {
    return registerMenuBarAccelerators({
      menus: allMenus.filter((menu) => menu.id !== 'apple'),
      optionKey,
      enableGlobalShortcuts,
      onMenuAction: (menuId, entry) => {
        entry.onSelect?.();
        onMenuAction?.(menuId, entry.id);
      },
    });
  });

  $effect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        altKeyHeld = true;
        if (platform === 'macos') optionKey = true;
      }
      if (mnemonicsEnabled && runtimePlatform !== 'macos' && event.altKey && !openMenuId) {
        const key = event.key.length === 1 ? event.key.toLowerCase() : '';
        if (!key) return;
        const binding = menuBarMnemonics.find((entry) => entry.mnemonicKey === key);
        if (binding) {
          event.preventDefault();
          openMenuId = binding.menuId;
        }
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        altKeyHeld = false;
        if (platform === 'macos') optionKey = false;
      }
    };
    const onBlur = () => {
      altKeyHeld = false;
      if (platform === 'macos') optionKey = false;
    };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  });

  function handleMenuOpenChange(menuId: string, next: boolean) {
    openMenuId = next ? menuId : null;
  }

  function handleMenuAction(menuId: string, entry: MenuItemConfig) {
    entry.onSelect?.();
    onMenuAction?.(menuId, entry.id);
  }

  function setRevealed(next: boolean) {
    if (revealed === undefined) internalRevealed = next;
    onRevealChange?.(next);
  }
</script>

{#if platform === 'ipados'}
  <div
    class={styles.revealZone}
    role="presentation"
    onpointerenter={() => setRevealed(true)}
    aria-hidden="true"
  ></div>
{/if}
<header
  role="menubar"
  aria-label={`${appName} menu bar`}
  class={cn(styles.menuBar, className)}
  {style}
  data-platform={platform}
  data-hidden={platform === 'ipados' ? (!isRevealed).toString() : undefined}
  onpointerenter={() => {
    if (platform === 'ipados') setRevealed(true);
  }}
  onpointerleave={() => {
    if (platform === 'ipados' && revealed === undefined) internalRevealed = false;
  }}
>
  <div class={styles.leading}>
    {#if showAppleMenu && platform === 'macos'}
      {@const prepared = resolveDynamicMenuEntries(prepareMenuEntries(appleMenu.entries), {
        optionKey,
      })}
      <Menu
        entries={prepared}
        open={openMenuId === 'apple'}
        onOpenChange={(next) => handleMenuOpenChange('apple', next)}
        dimBackground={false}
        layout="large"
        {optionKey}
        {enableTypeAhead}
        enableMnemonics={mnemonicsEnabled}
        {mnemonicVisible}
      >
        {#snippet children()}
          <button type="button" class={styles.menuTitle} aria-label={appleMenu.ariaLabel}>
            <span class={styles.appleMark} aria-hidden="true">{'\uF8FF'}</span>
          </button>
        {/snippet}
      </Menu>
    {/if}
    {#each menus as menu (menu.id)}
      {@const prepared = resolveDynamicMenuEntries(prepareMenuEntries(menu.entries), {
        optionKey,
      })}
      <Menu
        entries={prepared}
        open={openMenuId === menu.id}
        onOpenChange={(next) => handleMenuOpenChange(menu.id, next)}
        dimBackground={false}
        layout="large"
        onEntrySelect={(entry) => handleMenuAction(menu.id, entry)}
        {optionKey}
        {enableTypeAhead}
        enableMnemonics={mnemonicsEnabled}
        {mnemonicVisible}
      >
        {#snippet children()}
          <button
            type="button"
            class={styles.menuTitle}
            data-emphasized={menu.emphasized ? 'true' : undefined}
            data-menu-id={menu.id}
            aria-label={menu.ariaLabel}
          >
            <MnemonicLabel
              label={menu.title}
              mnemonic={menu.mnemonic}
              showAccessKey={mnemonicVisible}
            />
          </button>
        {/snippet}
      </Menu>
    {/each}
  </div>
  {#if extras.length > 0}
    <div class={styles.trailing} role="group" aria-label="Menu bar extras">
      {#each extras as extra (extra.id)}
        <MenuBarExtra
          id={extra.id}
          label={extra.label}
          entries={extra.entries}
          isOpen={openMenuId === extra.id}
          onOpenChange={(next) => handleMenuOpenChange(extra.id, next)}
          {optionKey}
          {mnemonicVisible}
          {enableTypeAhead}
          enableMnemonics={mnemonicsEnabled}
          onAction={(entry) => handleMenuAction(extra.id, entry)}
        >
          {#snippet icon()}
            {#if typeof extra.icon === 'function'}
              {@render (extra.icon as Snippet)()}
            {:else if extra.icon}
              {@html String(extra.icon)}
            {/if}
          {/snippet}
        </MenuBarExtra>
      {/each}
    </div>
  {/if}
</header>
