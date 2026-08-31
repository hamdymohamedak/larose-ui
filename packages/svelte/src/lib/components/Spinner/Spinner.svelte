<script lang="ts">
  import type { Size } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Spinner/Spinner.module.css';

  interface Props {
    size?: Size;
    label?: string;
  }

  let { size = 'md', label = 'Loading' }: Props = $props();
</script>

<span class={styles.spinner} data-size={size} role="status" aria-label={label}>
  <span class={styles.circle} aria-hidden="true"></span>
</span>
