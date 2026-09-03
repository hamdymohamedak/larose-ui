<script lang="ts">
  import { activateOverlayFocus } from '@larose-ui/primitives';
  import styles from '@larose-ui/styles/components/CommandPalette/CommandPalette.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';

  export interface CommandPaletteItem {
    id: string;
    label: string;
    group?: string;
    keywords?: string[];
    onSelect: () => void;
  }

  interface Props {
    open: boolean;
    items: CommandPaletteItem[];
    placeholder?: string;
    emptyMessage?: string;
    class?: string;
    style?: string;
    ariaLabel?: string;
    onOpenChange?: (open: boolean) => void;
  }

  let {
    open,
    items,
    placeholder = 'Search commands…',
    emptyMessage = 'No commands found',
    class: className,
    style,
    ariaLabel = 'Command palette',
    onOpenChange,
  }: Props = $props();

  let query = $state('');
  let activeIndex = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);
  let dialogEl = $state<HTMLElement | null>(null);

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase().includes(q),
    );
  });

  function close() {
    onOpenChange?.(false);
    query = '';
    activeIndex = 0;
  }

  function select(item: CommandPaletteItem) {
    item.onSelect();
    close();
  }

  $effect(() => {
    if (!open) return;
    query = '';
    activeIndex = 0;
    let deactivate: (() => void) | undefined;
    queueMicrotask(() => {
      inputEl?.focus();
      deactivate = activateOverlayFocus({
        container: dialogEl,
        onEscape: close,
        autoFocus: false,
      });
    });
    return () => deactivate?.();
  });

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, Math.max(filtered.length - 1, 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) select(item);
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    use:portal
    class={styles.overlay}
    role="presentation"
    onclick={(e) => {
      if (e.currentTarget === e.target) close();
    }}
    onkeydown={onKeyDown}
  >
    <div
      bind:this={dialogEl}
      class={cn(styles.dialog, className)}
      {style}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <input class={styles.search} {placeholder} bind:value={query} bind:this={inputEl} />
      <div class={styles.list} role="listbox">
        {#if !filtered.length}
          <p class={styles.empty}>{emptyMessage}</p>
        {:else}
          {#each filtered as item, index (item.id)}
            <button
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              class={styles.item}
              data-active={index === activeIndex ? 'true' : undefined}
              onclick={() => select(item)}
              onmouseenter={() => (activeIndex = index)}
            >
              {#if item.group}<span class={styles.groupLabel}>{item.group}</span>{/if}
              {item.label}
            </button>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}
