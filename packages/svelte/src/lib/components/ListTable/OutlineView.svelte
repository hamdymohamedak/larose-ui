<script lang="ts">
  import type { OutlineColumn, OutlineNode, SortDirection } from '../../ListTable/types';
  import {
    collectExpandableSubtree,
    filterOutline,
    flattenOutline,
    formatColumnHeader,
    nextSortDirection,
    normalizeOutlineColumns,
    sortOutlineNodes,
    truncateMiddle,
  } from '../../ListTable/utils';
  import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
  import { cn } from '../../utils/cn';

  const PRIMARY = 'label';
  const STORAGE = 'larose-outline-expanded';

  interface Props {
    data: OutlineNode[];
    primaryColumnHeader?: string;
    columns?: Array<string | OutlineColumn>;
    defaultExpandedIds?: string[];
    expandedIds?: string[];
    onExpandedChange?: (expandedIds: string[]) => void;
    storageKey?: string;
    selectedId?: string;
    onSelect?: (node: OutlineNode) => void;
    onRowDoubleClick?: (node: OutlineNode) => void;
    sortable?: boolean;
    defaultSortKey?: string;
    defaultSortDirection?: SortDirection;
    resizableColumns?: boolean;
    alternatingRows?: boolean;
    truncate?: 'middle' | 'end';
    searchQuery?: string;
    class?: string;
    style?: string;
    'aria-label'?: string;
  }

  let {
    data,
    primaryColumnHeader = 'Name',
    columns,
    defaultExpandedIds = [],
    expandedIds,
    onExpandedChange,
    storageKey,
    selectedId,
    onSelect,
    onRowDoubleClick,
    sortable = true,
    defaultSortKey = 'label',
    defaultSortDirection = 'asc',
    resizableColumns = true,
    alternatingRows = true,
    truncate = 'end',
    searchQuery = '',
    class: className,
    style,
    'aria-label': ariaLabel = 'Outline view',
  }: Props = $props();

  const normalized = $derived(normalizeOutlineColumns(columns));
  let internalExpanded = $state(new Set(defaultExpandedIds));
  const expanded = $derived(expandedIds !== undefined ? new Set(expandedIds) : internalExpanded);
  let sortKey = $state(defaultSortKey);
  let sortDirection = $state<SortDirection>(defaultSortDirection);
  let widths = $state<Record<string, number>>({ [PRIMARY]: 240 });

  $effect(() => {
    widths = {
      [PRIMARY]: widths[PRIMARY] ?? 240,
      ...Object.fromEntries(normalized.map((c) => [c.key, widths[c.key] ?? c.width ?? 128])),
    };
  });

  $effect(() => {
    if (!storageKey || expandedIds !== undefined || typeof window === 'undefined') return;
    window.localStorage.setItem(`${STORAGE}:${storageKey}`, JSON.stringify([...internalExpanded]));
  });

  const filtered = $derived(filterOutline(data, searchQuery));
  const sorted = $derived(sortOutlineNodes(filtered, sortKey, sortDirection));
  const rows = $derived(flattenOutline(sorted, expanded));

  function toggle(node: OutlineNode, altKey: boolean) {
    const next = new Set(expanded);
    if (altKey) {
      for (const id of collectExpandableSubtree(node)) {
        if (next.has(node.id)) next.delete(id);
        else next.add(id);
      }
    } else if (next.has(node.id)) {
      next.delete(node.id);
    } else {
      next.add(node.id);
    }
    if (expandedIds === undefined) internalExpanded = next;
    onExpandedChange?.([...next]);
  }

  function onSort(key: string) {
    sortDirection = nextSortDirection(sortKey, key, sortDirection);
    sortKey = key;
  }

  function startResize(key: string, startX: number) {
    const start = widths[key] ?? 128;
    const onMove = (e: MouseEvent) => {
      widths = { ...widths, [key]: Math.max(96, start + e.clientX - startX) };
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function text(v: string) {
    return truncate === 'middle' ? truncateMiddle(v) : v;
  }
</script>

<div class={cn(styles.outlineWrap, className)} {style}>
  <table class={styles.table} aria-label={ariaLabel}>
    <colgroup>
      <col style={`width:${widths[PRIMARY]}px`} />
      {#each normalized as column (column.key)}
        <col style={`width:${(widths[column.key] ?? 128)}px`} />
      {/each}
    </colgroup>
    <thead>
      <tr>
        <th scope="col" class={styles.tableHeadCell}>
          {#if sortable}
            <button
              type="button"
              class={styles.sortButton}
              data-active={sortKey === PRIMARY ? 'true' : undefined}
              onclick={() => onSort(PRIMARY)}
            >
              {formatColumnHeader(primaryColumnHeader)}{sortKey === PRIMARY
                ? sortDirection === 'asc'
                  ? ' ↑'
                  : ' ↓'
                : ''}
            </button>
          {:else}
            {formatColumnHeader(primaryColumnHeader)}
          {/if}
          {#if resizableColumns}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
              class={styles.resizeHandle}
              role="separator"
              onmousedown={(e) => startResize(PRIMARY, e.clientX)}
            ></span>
          {/if}
        </th>
        {#each normalized as column (column.key)}
          <th scope="col" class={styles.tableHeadCell}>
            {#if sortable && column.sortable !== false}
              <button
                type="button"
                class={styles.sortButton}
                data-active={sortKey === column.key ? 'true' : undefined}
                onclick={() => onSort(column.key)}
              >
                {formatColumnHeader(column.header)}{sortKey === column.key
                  ? sortDirection === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : ''}
              </button>
            {:else}
              {formatColumnHeader(column.header)}
            {/if}
            {#if resizableColumns}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <span
                class={styles.resizeHandle}
                role="separator"
                onmousedown={(e) => startResize(column.key, e.clientX)}
              ></span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as { node, depth }, index (node.id)}
        <tr
          class={styles.tableRow}
          data-selected={selectedId === node.id ? 'true' : undefined}
          data-alt={alternatingRows && index % 2 === 1 ? 'true' : undefined}
          style="cursor: pointer"
          onclick={() => onSelect?.(node)}
          ondblclick={() => onRowDoubleClick?.(node)}
        >
          <td class={styles.tableCell}>
            <div class={styles.outlineLabelCell}>
              <span class={styles.outlineIndent} style={`width:${depth}rem`}></span>
              {#if node.children?.length}
                <button
                  type="button"
                  class={styles.outlineToggle}
                  data-expanded={expanded.has(node.id) ? 'true' : 'false'}
                  aria-expanded={expanded.has(node.id)}
                  onclick={(event) => {
                    event.stopPropagation();
                    toggle(node, event.altKey);
                  }}
                >
                  <svg viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"
                    ><path d="M3 1.5 8 5 3 8.5V1.5Z" /></svg
                  >
                </button>
              {:else}
                <span class={styles.outlineSpacer} aria-hidden="true"></span>
              {/if}
              <span>{text(node.label)}</span>
            </div>
          </td>
          {#each normalized as column (column.key)}
            <td class={styles.tableCell}>{text(node.values?.[column.key] ?? '—')}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
