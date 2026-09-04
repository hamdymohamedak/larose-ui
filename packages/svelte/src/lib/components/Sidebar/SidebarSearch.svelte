<script lang="ts">
  import SearchField from '../SearchField/SearchField.svelte';
  import type { SearchFieldProps } from '../../SearchField/types';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    class: className,
    style,
    ...rest
  }: SearchFieldProps & { class?: string; style?: string } = $props();
</script>

<div class={[styles.search, className].filter(Boolean).join(' ')} {style}>
  <SearchField {...rest} />
</div>
