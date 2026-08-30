import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { SortDirection, TableSelectionMode } from './types';
import { formatColumnHeader, nextSortDirection, sortRows } from './utils';
import styles from './ListTable.module.css';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string;
  sortable?: boolean;
  width?: number;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string;
  caption?: string;
  'aria-label'?: string;
  selectionMode?: TableSelectionMode;
  selectedKey?: string;
  onSelectRow?: (row: T) => void;
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  alternatingRows?: boolean;
  resizableColumns?: boolean;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  caption,
  'aria-label': ariaLabel,
  selectionMode = 'none',
  selectedKey,
  onSelectRow,
  defaultSortKey,
  defaultSortDirection = 'asc',
  alternatingRows = true,
  resizableColumns = true,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? columns[0]?.key ?? '');
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [widths, setWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(columns.map((column) => [column.key, column.width ?? 160])),
  );

  const sortedData = useMemo(() => {
    const column = columns.find((entry) => entry.key === sortKey);
    if (!column?.sortable || !column.sortValue) return data;
    return sortRows(data, column.sortValue, sortDirection);
  }, [columns, data, sortDirection, sortKey]);

  const onSort = useCallback(
    (columnKey: string) => {
      setSortDirection((current) => nextSortDirection(sortKey, columnKey, current));
      setSortKey(columnKey);
    },
    [sortKey],
  );

  const startResize = useCallback(
    (columnKey: string, startX: number) => {
      const startWidth = widths[columnKey] ?? 160;
      const onMove = (event: MouseEvent) => {
        setWidths((current) => ({
          ...current,
          [columnKey]: Math.max(96, startWidth + event.clientX - startX),
        }));
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [widths],
  );

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table} aria-label={ariaLabel ?? caption}>
        {caption && <caption className={styles.tableCaption}>{caption}</caption>}
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={{ width: widths[column.key] }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={styles.tableHeadCell}>
                {column.sortable ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    data-active={sortKey === column.key ? 'true' : undefined}
                    onClick={() => onSort(column.key)}
                  >
                    {formatColumnHeader(column.header)}
                    {sortKey === column.key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                  </button>
                ) : (
                  formatColumnHeader(column.header)
                )}
                {resizableColumns && (
                  <span
                    className={styles.resizeHandle}
                    onMouseDown={(event) => startResize(column.key, event.clientX)}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize ${column.header} column`}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => {
            const key = keyExtractor(row);
            const selected = selectedKey === key;
            return (
              <tr
                key={key}
                className={styles.tableRow}
                data-selected={selected ? 'true' : undefined}
                data-alt={alternatingRows && index % 2 === 1 ? 'true' : undefined}
                onClick={
                  selectionMode !== 'none'
                    ? () => onSelectRow?.(row)
                    : undefined
                }
                style={selectionMode !== 'none' ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={styles.tableCell}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
