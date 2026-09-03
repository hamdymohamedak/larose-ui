<script lang="ts">
  import type { Snippet } from 'svelte';
  import { LONG_PRESS_MS } from '../../ContextMenu/utils';
  import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
  import {
    defaultDestructiveConfirmation,
    warnIfTooFewPullDownItems,
  } from '../../PullDownButton/utils';
  import styles from '@larose-ui/styles/components/PullDownButton/PullDownButton.module.css';
  import { cn } from '../../utils/cn';
  import Menu from '../Menu/Menu.svelte';
  import Dialog from '../Dialog/Dialog.svelte';

  export type PullDownButtonVariant = 'default' | 'more';

  let {
    label,
    entries,
    variant = 'default',
    menuTitle,
    onAction,
    destructiveConfirmation,
    disabled = false,
    longPress = false,
    icon,
    class: className,
    style,
  }: {
    label?: string;
    entries: MenuEntry[];
    variant?: PullDownButtonVariant;
    menuTitle?: string;
    onAction?: (entry: MenuItemConfig) => void;
    destructiveConfirmation?: {
      title?: string;
      description?: string;
      confirmLabel?: string;
      cancelLabel?: string;
    };
    disabled?: boolean;
    longPress?: boolean;
    icon?: Snippet;
    class?: string;
    style?: string;
  } = $props();

  let open = $state(false);
  let pendingDestructive = $state<MenuItemConfig | null>(null);
  let longPressTimer = $state<number | null>(null);

  const preparedEntries = $derived(
    entries.map((entry) => {
      if (entry.type === 'separator' || entry.type === 'submenu') return entry;
      return { ...entry, selected: undefined };
    }),
  );

  $effect(() => {
    warnIfTooFewPullDownItems(preparedEntries);
  });

  const triggerLabel = $derived(variant === 'more' ? (label ?? 'More') : (label ?? 'Menu'));

  const destructiveCopy = $derived(
    pendingDestructive
      ? {
          ...defaultDestructiveConfirmation(pendingDestructive.label),
          ...destructiveConfirmation,
          confirmLabel:
            destructiveConfirmation?.confirmLabel ?? pendingDestructive.label,
        }
      : null,
  );

  function clearLongPress() {
    if (longPressTimer !== null) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handleSelect(entry: MenuItemConfig) {
    if (entry.destructive) {
      pendingDestructive = entry;
      open = false;
      return false;
    }
    onAction?.(entry);
    return true;
  }

  function confirmDestructive() {
    if (!pendingDestructive) return;
    pendingDestructive.onSelect?.();
    onAction?.(pendingDestructive);
    pendingDestructive = null;
    open = false;
  }

  function cancelDestructive() {
    pendingDestructive = null;
  }
</script>

<Menu
  entries={preparedEntries}
  title={menuTitle}
  {open}
  onOpenChange={(next) => (open = next)}
  onEntrySelect={handleSelect}
>
  <button
    type="button"
    class={cn(styles.trigger, variant === 'more' && styles.moreTrigger, className)}
    {style}
    {disabled}
    aria-label={variant === 'more' ? triggerLabel : undefined}
    onpointerdown={(event) => {
      if (!longPress || event.pointerType === 'mouse') return;
      clearLongPress();
      longPressTimer = window.setTimeout(() => (open = true), LONG_PRESS_MS);
    }}
    onpointerup={clearLongPress}
    onpointercancel={clearLongPress}
    onpointerleave={clearLongPress}
  >
    {#if variant === 'more'}
      <svg class={styles.moreIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="12" r="1.75" />
        <circle cx="12" cy="12" r="1.75" />
        <circle cx="19" cy="12" r="1.75" />
      </svg>
    {:else}
      {#if icon}{@render icon()}{/if}
      <span class={styles.label}>{triggerLabel}</span>
      <svg class={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
        <path
          d="M2.5 4.5 6 8l3.5-3.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    {/if}
  </button>
</Menu>

{#if destructiveCopy}
  <Dialog
    open={Boolean(pendingDestructive)}
    title={destructiveCopy.title}
    description={destructiveCopy.description}
    confirmLabel={destructiveCopy.confirmLabel}
    cancelLabel={destructiveConfirmation?.cancelLabel ?? 'Cancel'}
    variant="destructive"
    onclose={cancelDestructive}
    onconfirm={confirmDestructive}
  />
{/if}
