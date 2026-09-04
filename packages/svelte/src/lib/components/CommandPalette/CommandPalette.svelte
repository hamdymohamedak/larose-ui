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

  const grouped = $derived.by(() => {
    const groups: Array<{
      group: string;
      items: Array<CommandPaletteItem & { flatIndex: number }>;
    }> = [];
    let flatIndex = 0;
    const buckets = new Map<string, Array<CommandPaletteItem & { flatIndex: number }>>();

    for (const item of filtered) {
      const key = item.group ?? 'Commands';
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = [];
        buckets.set(key, bucket);
        groups.push({ group: key, items: bucket });
      }
      bucket.push({ ...item, flatIndex });
      flatIndex += 1;
    }

    return groups;
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
      <input
        type="search"
        class={styles.search}
        {placeholder}
        bind:value={query}
        bind:this={inputEl}
        role="combobox"
        aria-controls="larose-command-list"
        aria-expanded={filtered.length > 0}
        aria-activedescendant={
          filtered[activeIndex] ? `larose-command-${filtered[activeIndex]!.id}` : undefined
        }
        aria-autocomplete="list"
        oninput={() => (activeIndex = 0)}
        onkeydown={onKeyDown}
      />
      <ul id="larose-command-list" class={styles.list} role="listbox" aria-label={ariaLabel}>
        {#if !filtered.length}
          <li class={styles.empty} role="presentation">{emptyMessage}</li>
        {:else}
          {#each grouped as section (section.group)}
            <li class={styles.group} role="presentation">
              <div class={styles.groupLabel}>{section.group}</div>
              <ul role="group" aria-label={section.group}>
                {#each section.items as item (item.id)}
                  <li role="presentation">
                    <button
                      id={`larose-command-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={item.flatIndex === activeIndex}
                      class={styles.item}
                      data-state={item.flatIndex === activeIndex ? 'active' : 'inactive'}
                      onclick={() => select(item)}
                      onmouseenter={() => (activeIndex = item.flatIndex)}
                    >
                      {item.label}
                    </button>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  </div>
{/if}
