<script lang="ts">
  import styles from '@larose-ui/styles/components/DataTable/DataTable.module.css';
  import { cn } from '../../utils/cn';
  import EmptyState from '../EmptyState/EmptyState.svelte';
  import Skeleton from '../Skeleton/Skeleton.svelte';

  export interface DataTableColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    accessor?: (row: T) => unknown;
    render?: (row: T) => unknown;
  }

  interface Props {
    data: Record<string, unknown>[];
    columns: DataTableColumn[];
    keyExtractor: (row: Record<string, unknown>) => string;
    caption?: string;
    ariaLabel?: string;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    striped?: boolean;
    skeletonRows?: number;
    class?: string;
    style?: string;
  }

  let {
    data,
    columns,
    keyExtractor,
    caption,
    ariaLabel,
    loading = false,
    emptyTitle = 'No data',
    emptyDescription,
    striped = false,
    skeletonRows = 3,
    class: className,
    style,
  }: Props = $props();

  function cell(row: Record<string, unknown>, column: DataTableColumn) {
    if (column.render) return column.render(row);
    if (column.accessor) return column.accessor(row);
    return row[column.key];
  }
</script>

<div class={cn(styles.wrapper, className)} {style}>
  {#if loading}
    {#each Array.from({ length: skeletonRows }) as _, i (i)}
      <div class={styles.skeletonRow}><Skeleton /></div>
    {/each}
  {:else if !data.length}
    <EmptyState title={emptyTitle} description={emptyDescription} class={styles.empty} />
  {:else}
    <table class={styles.table} aria-label={ariaLabel} data-striped={striped ? 'true' : undefined}>
      {#if caption}<caption class={styles.caption}>{caption}</caption>{/if}
      <thead>
        <tr>
          {#each columns as column (column.key)}
            <th class={styles.headCell} scope="col">{column.header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data as row (keyExtractor(row))}
          <tr class={styles.row}>
            {#each columns as column (column.key)}
              <td class={styles.cell}>{cell(row, column)}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
