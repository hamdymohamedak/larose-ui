<script lang="ts">
  import SearchIcon from './SearchIcon.svelte';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    value,
    placeholder = 'Search',
    onChange,
    'aria-label': ariaLabel = 'Search',
    class: className,
    style,
  }: {
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    'aria-label'?: string;
    class?: string;
    style?: string;
  } = $props();
</script>

<label class={[styles.searchWrap, className].filter(Boolean).join(' ')} {style}>
  <SearchIcon />
  <input
    type="search"
    class={styles.searchInput}
    {value}
    {placeholder}
    aria-label={ariaLabel}
    oninput={(event) => onChange?.((event.currentTarget as HTMLInputElement).value)}
  />
</label>
