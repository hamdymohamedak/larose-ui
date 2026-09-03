<script lang="ts">
  import type { Snippet } from 'svelte';
  import { LONG_PRESS_MS } from '../../ContextMenu/utils';
  import type { QuickActionIconPlacement, QuickActionItem } from '../../QuickActions/types';
  import {
    estimateQuickActionMenuHeight,
    prepareQuickActions,
    resolveQuickActionMenuPosition,
  } from '../../QuickActions/utils';
  import styles from '@larose-ui/styles/components/QuickActions/QuickActions.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';

  let {
    appName,
    icon,
    actions,
    iconPlacement = 'leading',
    includeSystemActions = true,
    systemActions,
    onActionSelect,
    open,
    onOpenChange,
    class: className,
    style,
  }: {
    appName: string;
    icon?: Snippet;
    actions: QuickActionItem[];
    iconPlacement?: QuickActionIconPlacement;
    includeSystemActions?: boolean;
    systemActions?: QuickActionItem[];
    onActionSelect?: (action: QuickActionItem) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    style?: string;
  } = $props();

  const menuId = $props.id();
  let iconEl = $state<HTMLDivElement | null>(null);
  let longPressTimer = $state<number | null>(null);
  let internalOpen = $state(false);
  let position = $state({ x: 0, y: 0 });

  const isOpen = $derived(open ?? internalOpen);
  const preparedActions = $derived(
    prepareQuickActions(actions, { includeSystemActions, systemActions }),
  );
  const appActions = $derived(preparedActions.filter((action) => !action.system));
  const systemGroup = $derived(preparedActions.filter((action) => action.system));

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  }

  function openAboveIcon() {
    const rect = iconEl?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 260;
    const menuHeight = estimateQuickActionMenuHeight(preparedActions.length);
    position = resolveQuickActionMenuPosition(rect, menuWidth, menuHeight);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function clearLongPress() {
    if (longPressTimer !== null) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handleSelect(action: QuickActionItem) {
    if (action.disabled) return;
    action.onSelect?.();
    onActionSelect?.(action);
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

<div class={cn(styles.quickActionsWrap, className)} {style}>
  <div
    bind:this={iconEl}
    class={styles.appIcon}
    role="button"
    tabindex="0"
    aria-label={appName}
    aria-haspopup="menu"
    aria-expanded={isOpen}
    aria-controls={isOpen ? menuId : undefined}
    onpointerdown={(event) => {
      if (event.pointerType === 'mouse') return;
      clearLongPress();
      longPressTimer = window.setTimeout(openAboveIcon, LONG_PRESS_MS);
    }}
    onpointerup={clearLongPress}
    onpointercancel={clearLongPress}
    onpointerleave={clearLongPress}
    oncontextmenu={(event) => {
      event.preventDefault();
      openAboveIcon();
    }}
  >
    {#if icon}{@render icon()}{/if}
  </div>
  <span class={styles.hint}>Touch and hold for quick actions</span>

  {#if isOpen}
    <div use:portal>
      <div class={styles.menuBackdrop} role="presentation" onclick={close}></div>
      <div
        id={menuId}
        class={styles.menu}
        role="menu"
        aria-label={`${appName} quick actions`}
        style={`position:fixed;left:${position.x}px;top:${position.y}px;z-index:1000;`}
        onclick={(event) => event.stopPropagation()}
      >
        <ul class={styles.list}>
          {#each appActions as action (action.id)}
            <li>
              <button
                type="button"
                class={styles.row}
                role="menuitem"
                data-icon-placement={iconPlacement}
                data-destructive={action.destructive ? 'true' : undefined}
                disabled={action.disabled}
                onclick={() => handleSelect(action)}
              >
                <span class={styles.textBlock}>
                  <span class={styles.title}>{action.label}</span>
                  {#if action.subtitle}
                    <span class={styles.subtitle}>{action.subtitle}</span>
                  {/if}
                </span>
              </button>
            </li>
          {/each}
          {#if systemGroup.length > 0}
            <li class={styles.systemGroup} role="presentation">
              <ul class={styles.list}>
                {#each systemGroup as action (action.id)}
                  <li>
                    <button
                      type="button"
                      class={styles.row}
                      role="menuitem"
                      data-icon-placement={iconPlacement}
                      data-destructive={action.destructive ? 'true' : undefined}
                      disabled={action.disabled}
                      onclick={() => handleSelect(action)}
                    >
                      <span class={styles.textBlock}>
                        <span class={styles.title}>{action.label}</span>
                      </span>
                    </button>
                  </li>
                {/each}
              </ul>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  {/if}
</div>
