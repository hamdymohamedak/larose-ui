import { useCallback, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { DisclosureTriangle } from './DisclosureTriangle';
import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';

export interface DisclosureGroupProps {
  label: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * SwiftUI DisclosureGroup-style wrapper for progressive reveal.
 * @see https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
 */
export function DisclosureGroup(props: DisclosureGroupProps) {
  return <DisclosureTriangle {...props} />;
}

export interface DisclosureListItem {
  id: string;
  label: string;
  children?: DisclosureListItem[];
  content?: ReactNode;
}

export interface DisclosureListProps {
  items: DisclosureListItem[];
  defaultExpandedIds?: string[];
  className?: string;
  style?: CSSProperties;
}

function DisclosureListNode({
  item,
  expandedIds,
  onToggle,
  level,
}: {
  item: DisclosureListItem;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  level: number;
}) {
  const hasNested = Boolean(item.children?.length || item.content);
  const isExpanded = expandedIds.has(item.id);

  if (!hasNested) {
    return (
      <li className={styles.nestedItem}>
        <span className={styles.triangleLabel} style={{ paddingInlineStart: `calc(${level} * var(--lr-disclosure-hit-region))` }}>
          {item.label}
        </span>
      </li>
    );
  }

  return (
    <li className={styles.nestedItem}>
      <DisclosureTriangle
        label={item.label}
        expanded={isExpanded}
        onExpandedChange={() => onToggle(item.id)}
      >
        {item.content}
        {item.children && isExpanded && (
          <ul className={styles.nestedList}>
            {item.children.map((child) => (
              <DisclosureListNode
                key={child.id}
                item={child}
                expandedIds={expandedIds}
                onToggle={onToggle}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </DisclosureTriangle>
    </li>
  );
}

/** Finder-style hierarchical list with disclosure triangles. */
export function DisclosureList({ items, defaultExpandedIds = [], className, style }: DisclosureListProps) {
  const listId = useId();
  const [expandedIds, setExpandedIds] = useState(() => new Set(defaultExpandedIds));

  const onToggle = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <ul
      id={listId}
      className={[styles.nestedList, className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Disclosure list"
    >
      {items.map((item) => (
        <DisclosureListNode
          key={item.id}
          item={item}
          expandedIds={expandedIds}
          onToggle={onToggle}
          level={0}
        />
      ))}
    </ul>
  );
}
