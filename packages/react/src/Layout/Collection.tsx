import type { CSSProperties } from 'react';
import type { CollectionItem, CollectionLayout } from './types';
import styles from '@larose-ui/styles/components/Layout/Layout.module.css';

export interface CollectionProps {
  items: CollectionItem[];
  layout?: CollectionLayout;
  columns?: number;
  selectedId?: string;
  onSelect?: (item: CollectionItem) => void;
  ariaLabel?: string;
}

/**
 * Visual row or grid of image-based items with comfortable padding.
 * @see https://developer.apple.com/design/human-interface-guidelines/collections
 */
export function Collection({
  items,
  layout = 'grid',
  columns = 4,
  selectedId,
  onSelect,
  ariaLabel = 'Collection',
}: CollectionProps) {
  return (
    <div
      className={styles.collection}
      data-layout={layout}
      style={layout === 'grid' ? ({ '--lr-collection-columns': String(columns) } as CSSProperties) : undefined}
      role="list"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="listitem"
          className={[styles.item, styles.itemEnter].join(' ')}
          data-selected={selectedId === item.id ? 'true' : undefined}
          aria-pressed={selectedId === item.id}
          onClick={() => onSelect?.(item)}
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className={styles.itemImage} />
          ) : (
            item.content
          )}
          {item.label && <span className={styles.itemLabel}>{item.label}</span>}
        </button>
      ))}
    </div>
  );
}
