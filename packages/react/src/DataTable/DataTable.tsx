import type { ReactNode } from 'react';
import { EmptyState } from '../EmptyState/EmptyState';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from './DataTable.module.css';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor?: (row: T) => ReactNode;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor: (row: T) => string;
  caption?: string;
  'aria-label'?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyMessage?: string;
  striped?: boolean;
  skeletonRows?: number;
  className?: string;
}

function renderCell<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.render) return column.render(row);
  if (column.accessor) return column.accessor(row);
  return null;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  caption,
  'aria-label': ariaLabel,
  loading = false,
  emptyTitle = 'No data',
  emptyDescription,
  emptyMessage,
  striped = false,
  skeletonRows = 3,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div
        className={[styles.wrapper, className].filter(Boolean).join(' ')}
        data-state="loading"
        aria-busy="true"
        aria-label={ariaLabel ?? caption ?? 'Loading table'}
      >
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <div key={index} className={styles.skeletonRow}>
            {columns.map((column) => (
              <Skeleton key={column.key} height="1rem" width={`${100 / columns.length}%`} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={[styles.wrapper, className].filter(Boolean).join(' ')}
        data-state="empty"
      >
        <div className={styles.empty}>
          <EmptyState
            title={emptyTitle}
            description={emptyDescription ?? emptyMessage}
            state="empty"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-state="ready">
      <table className={styles.table} aria-label={ariaLabel}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={styles.headCell}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className={styles.row} data-striped={striped ? 'true' : undefined}>
              {columns.map((column) => (
                <td key={column.key} className={styles.cell}>
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
