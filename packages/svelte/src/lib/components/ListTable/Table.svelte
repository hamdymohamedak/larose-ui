<script lang="ts">
  import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
  import { cn } from '../../utils/cn';
  import { formatColumnHeader } from '../../ListTable/utils';

  export interface TableColumn {
    key: string;
    header: string;
    accessor?: (row: Record<string, unknown>) => unknown;
  }

  interface Props {
    data: Record<string, unknown>[];
    columns: TableColumn[];
    keyExtractor: (row: Record<string, unknown>) => string;
    caption?: string;
    class?: string;
    style?: string;
  }

  let { data, columns, keyExtractor, caption, class: className, style }: Props = $props();
</script>

<div class={cn(styles.tableWrap, className)} {style}>
  <table class={styles.table}>
    {#if caption}<caption class={styles.tableCaption}>{caption}</caption>{/if}
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th class={styles.tableHeadCell} scope="col">{formatColumnHeader(column.header)}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row (keyExtractor(row))}
        <tr class={styles.tableRow}>
          {#each columns as column (column.key)}
            <td class={styles.tableCell}>{column.accessor ? column.accessor(row) : row[column.key]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
