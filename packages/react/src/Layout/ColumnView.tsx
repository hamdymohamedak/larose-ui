import { useMemo, useState, type CSSProperties } from 'react';
import type { ColumnViewNode } from './types';
import { findNodeByPath, getNodesAtPath, hasChildren } from './utils';
import styles from '@larose-ui/styles/components/Layout/Layout.module.css';

export interface ColumnViewProps {
  data: ColumnViewNode[];
  initialPath?: string[];
  onPathChange?: (path: string[]) => void;
  ariaLabel?: string;
}

function DisclosureIcon() {
  return <span className={styles.disclosure} aria-hidden="true">›</span>;
}

/**
 * Hierarchical browser with resizable columns and optional detail pane.
 * @see https://developer.apple.com/design/human-interface-guidelines/column-views
 */
export function ColumnView({
  data,
  initialPath = [],
  onPathChange,
  ariaLabel = 'Column view',
}: ColumnViewProps) {
  const [path, setPath] = useState<string[]>(initialPath);

  const columns = useMemo(() => {
    const result: ColumnViewNode[][] = [data];
    let nodes = data;
    for (const id of path) {
      const node = nodes.find((entry) => entry.id === id);
      if (!node?.children?.length) break;
      result.push(node.children);
      nodes = node.children;
    }
    return result;
  }, [data, path]);

  const selected = findNodeByPath(data, path);

  const selectAtLevel = (level: number, node: ColumnViewNode) => {
    const next = [...path.slice(0, level), node.id];
    setPath(next);
    onPathChange?.(next);
  };

  return (
    <div className={styles.columnView} aria-label={ariaLabel}>
      {columns.map((nodes, level) => (
        <div
          key={`column-${level}`}
          className={styles.column}
          style={{ '--lr-column-width': 'var(--lr-column-view-width)' } as CSSProperties}
          role="list"
          aria-label={`Level ${level + 1}`}
        >
          {nodes.map((node) => {
            const isSelected = path[level] === node.id;
            return (
              <button
                key={node.id}
                type="button"
                className={styles.row}
                data-selected={isSelected ? 'true' : undefined}
                onClick={() => selectAtLevel(level, node)}
              >
                {hasChildren(node) ? <DisclosureIcon /> : <span className={styles.disclosure} />}
                <span>{node.label}</span>
              </button>
            );
          })}
        </div>
      ))}
      <aside className={styles.detailPane} aria-label="Item details">
        {selected ? (
          <>
            <strong>{selected.label}</strong>
            {selected.detail}
            {selected.meta && (
              <dl className={styles.detailMeta}>
                {Object.entries(selected.meta).map(([key, value]) => (
                  <div key={key} className={styles.detailMetaRow}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {!hasChildren(selected) && !selected.detail && !selected.meta && (
              <p style={{ marginTop: '0.75rem', color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
                No nested items to display.
              </p>
            )}
          </>
        ) : (
          <span style={{ color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
            Select an item to preview details.
          </span>
        )}
      </aside>
    </div>
  );
}

export { getNodesAtPath };
