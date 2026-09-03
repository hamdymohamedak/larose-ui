<script lang="ts">
  import type { Snippet } from 'svelte';
  import type {
    EditMenuContext,
    EditMenuInputMode,
    EditMenuItemConfig,
    EditMenuPosition,
    EditMenuResolvedAction,
    EditMenuVariant,
    StandardEditActionId,
  } from '../../EditMenu/types';
  import {
    buildEditMenuActions,
    canExpandCompactMenu,
    compactVisibleCount,
    filterVisibleEditMenuActions,
    LONG_PRESS_MS,
    resolveEditMenuPosition,
    resolveEditMenuVariant,
  } from '../../EditMenu/utils';
  import { portal } from '../../utils/portal';
  import styles from '@larose-ui/styles/components/EditMenu/EditMenu.module.css';
  import { cn } from '../../utils/cn';

  let {
    children,
    context,
    customActions = [],
    includeStandardActions = true,
    variant = 'auto',
    inputMode = 'auto',
    placement = 'auto',
    open,
    onOpenChange,
    onAction,
    onStandardAction,
    longPress = true,
    dimBackground = true,
    class: className,
    style,
  }: {
    children?: Snippet;
    context: EditMenuContext;
    customActions?: EditMenuItemConfig[];
    includeStandardActions?: boolean;
    variant?: EditMenuVariant;
    inputMode?: EditMenuInputMode;
    placement?: 'above' | 'below' | 'auto';
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (actionId: string) => void;
    onStandardAction?: (actionId: StandardEditActionId) => void;
    longPress?: boolean;
    dimBackground?: boolean;
    class?: string;
    style?: string;
  } = $props();

  const menuId = $props.id();
  let triggerEl = $state<HTMLSpanElement | null>(null);
  let internalOpen = $state(false);
  let resolvedVariant = $state<'compact' | 'context'>(
    resolveEditMenuVariant(variant, inputMode, 'mouse'),
  );
  let expanded = $state(false);
  let position = $state<EditMenuPosition>({
    x: 100,
    y: 100,
    placement: 'below',
    pointerOffset: 110,
  });
  let longPressTimer: number | null = null;
  const isOpen = $derived(open ?? internalOpen);
  const actions = $derived(
    filterVisibleEditMenuActions(
      buildEditMenuActions(context, customActions, {
        includeStandard: includeStandardActions,
        onStandardAction,
      }),
    ),
  );
  const showCompact = $derived(resolvedVariant === 'compact' && !expanded);

  function setOpen(next: boolean) {
    if (!next) expanded = false;
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  }

  function measureAndOpen(pointerType: string, anchorRect?: DOMRect) {
    const resolved = resolveEditMenuVariant(variant, inputMode, pointerType);
    resolvedVariant = expanded ? 'context' : resolved;
    const rect =
      anchorRect ??
      triggerEl?.getBoundingClientRect() ??
      new DOMRect(window.innerWidth / 2 - 40, window.innerHeight / 2, 80, 24);
    const menuWidth =
      resolved === 'compact' && !expanded
        ? Math.min(320, actions.length * 72 + 48)
        : 220;
    const menuHeight =
      resolved === 'compact' && !expanded
        ? 40
        : Math.min(360, actions.length * 36 + 16);
    position = resolveEditMenuPosition(rect, menuWidth, menuHeight, placement);
    setOpen(true);
  }

  function clearLongPress() {
    if (longPressTimer !== null) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handleSelect(action: EditMenuResolvedAction) {
    action.onSelect?.();
    onAction?.(action.id);
    setOpen(false);
  }

  function handleExpand() {
    expanded = true;
    resolvedVariant = 'context';
    const rect =
      triggerEl?.getBoundingClientRect() ?? new DOMRect(position.x, position.y, 80, 24);
    position = resolveEditMenuPosition(
      rect,
      220,
      Math.min(360, actions.length * 36 + 16),
      placement,
    );
  }

  $effect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });
</script>

<span
  bind:this={triggerEl}
  class={cn(styles.triggerWrap, className)}
  {style}
  oncontextmenu={(event) => {
    event.preventDefault();
    measureAndOpen('mouse', new DOMRect(event.clientX, event.clientY, 1, 1));
  }}
  ondblclick={(event) =>
    measureAndOpen('touch', (event.currentTarget as HTMLElement).getBoundingClientRect())}
  onpointerdown={(event) => {
    if (!longPress || event.pointerType === 'mouse') return;
    clearLongPress();
    longPressTimer = window.setTimeout(() => {
      measureAndOpen(
        event.pointerType,
        (event.currentTarget as HTMLElement).getBoundingClientRect(),
      );
    }, LONG_PRESS_MS);
  }}
  onpointerup={clearLongPress}
  onpointercancel={clearLongPress}
  onpointerleave={clearLongPress}
>
  {@render children?.()}
</span>

{#if isOpen && actions.length > 0}
  <div use:portal>
    {#if dimBackground}
      <div class={styles.menuBackdrop} role="presentation" onclick={() => setOpen(false)}></div>
    {/if}
    <div
      class={showCompact ? styles.compactWrap : styles.contextWrap}
      role={showCompact ? 'toolbar' : undefined}
      aria-label="Edit menu"
      data-placement={position.placement}
      style={`position:fixed;left:${position.x}px;top:${position.y}px;--lr-edit-menu-pointer-x:${position.pointerOffset}px;z-index:1000;${style ?? ''}`}
    >
      <span
        class={styles.pointer}
        aria-hidden="true"
        data-placement={position.placement}
        style="--lr-edit-menu-pointer-offset:var(--lr-edit-menu-pointer-x)"
      ></span>
      {#if showCompact}
        <div id={menuId} class={styles.compactBar}>
          {#each actions.slice(0, compactVisibleCount(actions.length)) as action, index (action.id)}
            {#if index > 0}<span class={styles.compactDivider} aria-hidden="true"></span>{/if}
            <button
              type="button"
              class={styles.compactItem}
              data-destructive={action.destructive ? 'true' : undefined}
              disabled={action.disabled}
              onclick={() => handleSelect(action)}
            >
              {action.label}
            </button>
          {/each}
          {#if canExpandCompactMenu(actions.length)}
            <span class={styles.compactDivider} aria-hidden="true"></span>
            <button
              type="button"
              class={styles.expandButton}
              aria-label="More edit actions"
              aria-haspopup="menu"
              onclick={handleExpand}
            >
              <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" aria-hidden="true">
                <path
                  d="M4 2.5 8 6l-4 3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          {/if}
        </div>
      {:else}
        <div
          id={menuId}
          class={styles.contextMenu}
          role="menu"
          aria-label="Edit menu"
          style="position:relative"
        >
          <ul class={styles.list}>
            {#each actions as action, index (action.id)}
              {@const prev = actions[index - 1]}
              {@const showSeparator =
                index > 0 && (prev?.group ?? 'other') !== (action.group ?? 'other')}
              {#if showSeparator}<li class={styles.separator} role="separator"></li>{/if}
              <li>
                <button
                  type="button"
                  class={styles.contextItem}
                  role="menuitem"
                  data-destructive={action.destructive ? 'true' : undefined}
                  disabled={action.disabled}
                  onclick={() => handleSelect(action)}
                >
                  {#if action.icon}<span class={styles.icon}></span>{/if}
                  <span class={styles.label}>{action.label}</span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
{/if}
