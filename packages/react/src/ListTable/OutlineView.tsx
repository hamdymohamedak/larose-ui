import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type CSSProperties,
} from 'react';
import type { OutlineColumn, OutlineNode, SortDirection } from './types';
import {
  collectExpandableSubtree,
  filterOutline,
  flattenOutline,
  formatColumnHeader,
  nextSortDirection,
  normalizeOutlineColumns,
  sortOutlineNodes,
  truncateMiddle,
} from './utils';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

const PRIMARY_COLUMN_KEY = 'label';
const STORAGE_PREFIX = 'larose-outline-expanded';

export interface OutlineViewProps {
  data: OutlineNode[];
  primaryColumnHeader?: string;
  columns?: Array<string | OutlineColumn>;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Persist expansion state across sessions (localStorage). */
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
  editableColumns?: string[];
  onCellEdit?: (nodeId: string, columnKey: string, value: string) => void;
  searchQuery?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

function loadExpanded(storageKey: string | undefined, fallback: string[]): Set<string> {
  if (storageKey && typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(`${STORAGE_PREFIX}:${storageKey}`);
      if (stored) return new Set(JSON.parse(stored) as string[]);
    } catch {
      // ignore invalid storage
    }
  }
  return new Set(fallback);
}

function renderCellText(text: string, truncate: 'middle' | 'end', maxLength = 48): string {
  if (truncate === 'middle') return truncateMiddle(text, maxLength);
  return text;
}

export function OutlineView({
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
  defaultSortKey = PRIMARY_COLUMN_KEY,
  defaultSortDirection = 'asc',
  resizableColumns = true,
  alternatingRows = true,
  truncate = 'end',
  editableColumns = [],
  onCellEdit,
  searchQuery = '',
  className,
  style,
  'aria-label': ariaLabel = 'Outline view',
}: OutlineViewProps) {
  const normalizedColumns = useMemo(() => normalizeOutlineColumns(columns), [columns]);
  const isControlledExpansion = expandedIds !== undefined;

  const [internalExpanded, setInternalExpanded] = useState(() =>
    loadExpanded(storageKey, defaultExpandedIds),
  );
  const expanded = useMemo(
    () => (isControlledExpansion ? new Set(expandedIds) : internalExpanded),
    [expandedIds, internalExpanded, isControlledExpansion],
  );

  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [widths, setWidths] = useState<Record<string, number>>(() => ({
    [PRIMARY_COLUMN_KEY]: 240,
    ...Object.fromEntries(normalizedColumns.map((column) => [column.key, column.width ?? 128])),
  }));
  const [editingCell, setEditingCell] = useState<{ nodeId: string; columnKey: string } | null>(
    null,
  );
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!storageKey || isControlledExpansion || typeof window === 'undefined') return;
    window.localStorage.setItem(
      `${STORAGE_PREFIX}:${storageKey}`,
      JSON.stringify([...internalExpanded]),
    );
  }, [internalExpanded, isControlledExpansion, storageKey]);

  const setExpanded = useCallback(
    (next: Set<string>) => {
      if (!isControlledExpansion) setInternalExpanded(next);
      onExpandedChange?.([...next]);
    },
    [isControlledExpansion, onExpandedChange],
  );

  const filteredData = useMemo(() => filterOutline(data, searchQuery), [data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortable) return filteredData;
    return sortOutlineNodes(filteredData, sortKey, sortDirection);
  }, [filteredData, sortDirection, sortKey, sortable]);

  const autoExpanded = useMemo(() => {
    if (!searchQuery.trim()) return expanded;
    const next = new Set(expanded);
    const walk = (nodes: OutlineNode[]) => {
      for (const node of nodes) {
        if (node.children?.length) {
          next.add(node.id);
          walk(node.children);
        }
      }
    };
    walk(filteredData);
    return next;
  }, [expanded, filteredData, searchQuery]);

  const rows = useMemo(() => flattenOutline(sortedData, autoExpanded), [autoExpanded, sortedData]);

  const onSort = useCallback(
    (columnKey: string) => {
      if (!sortable) return;
      setSortDirection((current) => nextSortDirection(sortKey, columnKey, current));
      setSortKey(columnKey);
    },
    [sortKey, sortable],
  );

  const toggle = useCallback(
    (node: OutlineNode, expandAll: boolean) => {
      const next = new Set(expanded);
      if (expandAll) {
        for (const id of collectExpandableSubtree(node)) next.add(id);
      } else if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      setExpanded(next);
    },
    [expanded, setExpanded],
  );

  const startResize = useCallback(
    (columnKey: string, startX: number) => {
      const startWidth = widths[columnKey] ?? 128;
      const onMove = (event: globalThis.MouseEvent) => {
        setWidths((current) => ({
          ...current,
          [columnKey]: Math.max(72, startWidth + event.clientX - startX),
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

  const startEditing = useCallback(
    (node: OutlineNode, columnKey: string) => {
      if (!editableColumns.includes(columnKey) || !onCellEdit) return;
      const value = columnKey === PRIMARY_COLUMN_KEY ? node.label : (node.values?.[columnKey] ?? '');
      setEditingCell({ nodeId: node.id, columnKey });
      setEditValue(value);
    },
    [editableColumns, onCellEdit],
  );

  const commitEdit = useCallback(() => {
    if (!editingCell || !onCellEdit) return;
    onCellEdit(editingCell.nodeId, editingCell.columnKey, editValue);
    setEditingCell(null);
    setEditValue('');
  }, [editValue, editingCell, onCellEdit]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  const onEditKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') commitEdit();
      if (event.key === 'Escape') cancelEdit();
    },
    [cancelEdit, commitEdit],
  );

  const renderEditableCell = (node: OutlineNode, columnKey: string, display: string) => {
    const isEditing = editingCell?.nodeId === node.id && editingCell.columnKey === columnKey;
    if (isEditing) {
      return (
        <input
          className={styles.outlineEditInput}
          value={editValue}
          autoFocus
          onChange={(event) => setEditValue(event.target.value)}
          onBlur={commitEdit}
          onKeyDown={onEditKeyDown}
          onClick={(event) => event.stopPropagation()}
        />
      );
    }

    return (
      <span
        className={styles.outlineCellText}
        data-truncate={truncate === 'middle' ? 'middle' : undefined}
        onClick={(event) => {
          if (!editableColumns.includes(columnKey)) return;
          event.stopPropagation();
          startEditing(node, columnKey);
        }}
      >
        {renderCellText(display, truncate)}
      </span>
    );
  };

  const columnKeys = [PRIMARY_COLUMN_KEY, ...normalizedColumns.map((column) => column.key)];

  return (
    <div className={[styles.outlineWrap, className].filter(Boolean).join(' ')} style={style}>
      <table className={styles.table} aria-label={ariaLabel}>
        <colgroup>
          {columnKeys.map((key) => (
            <col key={key} style={{ width: widths[key] }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={styles.tableHeadCell}>
              {sortable ? (
                <button
                  type="button"
                  className={styles.sortButton}
                  data-active={sortKey === PRIMARY_COLUMN_KEY ? 'true' : undefined}
                  onClick={() => onSort(PRIMARY_COLUMN_KEY)}
                >
                  {formatColumnHeader(primaryColumnHeader)}
                  {sortKey === PRIMARY_COLUMN_KEY ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                </button>
              ) : (
                formatColumnHeader(primaryColumnHeader)
              )}
              {resizableColumns && (
                <span
                  className={styles.resizeHandle}
                  onMouseDown={(event) => startResize(PRIMARY_COLUMN_KEY, event.clientX)}
                  role="separator"
                  aria-orientation="vertical"
                  aria-label={`Resize ${primaryColumnHeader} column`}
                />
              )}
            </th>
            {normalizedColumns.map((column) => (
              <th key={column.key} scope="col" className={styles.tableHeadCell}>
                {sortable && column.sortable !== false ? (
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
          {rows.map(({ node, depth }, index) => {
            const hasChildren = Boolean(node.children?.length);
            const isExpanded = autoExpanded.has(node.id);
            return (
              <tr
                key={node.id}
                className={styles.tableRow}
                data-selected={selectedId === node.id ? 'true' : undefined}
                data-alt={alternatingRows && index % 2 === 1 ? 'true' : undefined}
                onClick={() => onSelect?.(node)}
                onDoubleClick={() => onRowDoubleClick?.(node)}
                style={{ cursor: onSelect || onRowDoubleClick ? 'pointer' : undefined }}
              >
                <td className={styles.tableCell}>
                  <div className={styles.outlineLabelCell}>
                    <span className={styles.outlineIndent} style={{ width: `${depth}rem` }} />
                    {hasChildren ? (
                      <button
                        type="button"
                        className={styles.outlineToggle}
                        data-expanded={isExpanded ? 'true' : 'false'}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.label}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggle(node, event.altKey);
                        }}
                      >
                        <svg viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                          <path d="M3 1.5 8 5 3 8.5V1.5Z" />
                        </svg>
                      </button>
                    ) : (
                      <span className={styles.outlineSpacer} aria-hidden="true" />
                    )}
                    {renderEditableCell(node, PRIMARY_COLUMN_KEY, node.label)}
                  </div>
                </td>
                {normalizedColumns.map((column) => (
                  <td key={column.key} className={styles.tableCell}>
                    {renderEditableCell(node, column.key, node.values?.[column.key] ?? '—')}
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
