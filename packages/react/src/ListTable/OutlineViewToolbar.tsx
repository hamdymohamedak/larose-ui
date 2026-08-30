import styles from './ListTable.module.css';

export interface OutlineViewToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  'aria-label'?: string;
}

/** Toolbar search field for lengthy outline views. */
export function OutlineViewToolbar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search',
  'aria-label': ariaLabel = 'Search outline view',
}: OutlineViewToolbarProps) {
  return (
    <div className={styles.outlineToolbar}>
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
