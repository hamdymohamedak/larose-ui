<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Layout/Layout.module.css';
  import { cn } from '../../utils/cn';
  import { findNodeByPath } from '../../Layout/utils';
  import type { ColumnViewNode } from '../../Layout/types';

  interface Props {
    root: ColumnViewNode[];
    path?: string[];
    class?: string;
    style?: string;
    ariaLabel?: string;
    onPathChange?: (path: string[]) => void;
    detail?: Snippet<[ColumnViewNode]>;
  }

  let {
    root,
    path = $bindable<string[]>([]),
    class: className,
    style,
    ariaLabel = 'Column view',
    onPathChange,
    detail,
  }: Props = $props();

  const columns = $derived.by(() => {
    const cols: ColumnViewNode[][] = [root];
    let current = root;
    for (const id of path) {
      const node = current.find((n) => n.id === id);
      if (!node?.children) break;
      current = node.children;
      cols.push(current);
    }
    return cols;
  });
  const selected = $derived(findNodeByPath(root, path));

  function selectAt(columnIndex: number, id: string) {
    path = [...path.slice(0, columnIndex), id];
    onPathChange?.(path);
  }
</script>

<div class={cn(styles.columnView, className)} {style} aria-label={ariaLabel}>
  {#each columns as nodes, columnIndex}
    <div class={styles.column} role="listbox" aria-label={`Column ${columnIndex + 1}`}>
      {#each nodes as node (node.id)}
        <button
          type="button"
          class={styles.row}
          role="option"
          aria-selected={path[columnIndex] === node.id}
          onclick={() => selectAt(columnIndex, node.id)}
        >
          <span>{node.label}</span>
          {#if node.children?.length}
            <span class={styles.disclosure} aria-hidden="true">›</span>
          {/if}
        </button>
      {/each}
    </div>
  {/each}
  {#if selected}
    <div class={styles.detailPane}>
      {#if detail}{@render detail(selected)}{/if}
      {#if selected.meta}
        <dl class={styles.detailMeta}>
          {#each Object.entries(selected.meta) as [key, value] (key)}
            <div class={styles.detailMetaRow}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          {/each}
        </dl>
      {/if}
    </div>
  {/if}
</div>
