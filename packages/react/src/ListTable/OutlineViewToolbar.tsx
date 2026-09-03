import type { CSSProperties } from 'react';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

export interface OutlineViewToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

/** Toolbar search field for lengthy outline views. */
export function OutlineViewToolbar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search',
  className,
  style,
  'aria-label': ariaLabel = 'Search outline view',
}: OutlineViewToolbarProps) {
  return (
    <div className={[styles.outlineToolbar, className].filter(Boolean).join(' ')} style={style}>
      <input
        type="search"
        className={styles.outlineSearch}
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  );
}
