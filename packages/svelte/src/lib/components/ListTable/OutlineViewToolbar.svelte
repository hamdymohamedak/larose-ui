<script lang="ts">
  import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

  let {
    searchQuery,
    onSearchChange,
    placeholder = 'Search',
    class: className,
    style,
    'aria-label': ariaLabel = 'Search outline view',
  }: {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
    class?: string;
    style?: string;
    'aria-label'?: string;
  } = $props();
</script>

<div class={[styles.outlineToolbar, className].filter(Boolean).join(' ')} {style}>
  <input
    type="search"
    class={styles.outlineSearch}
    value={searchQuery}
    oninput={(event) => onSearchChange((event.currentTarget as HTMLInputElement).value)}
    {placeholder}
    aria-label={ariaLabel}
  />
</div>
