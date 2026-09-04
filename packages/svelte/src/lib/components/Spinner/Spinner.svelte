<script lang="ts">
  import type { Size } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Spinner/Spinner.module.css';

  interface Props {
    size?: Size;
    label?: string;
    class?: string;
    style?: string;
  }

  let { size = 'md', label = 'Loading', class: className, style }: Props = $props();
</script>

<span class={[styles.spinner, className].filter(Boolean).join(' ')} {style} data-size={size} role="status" aria-label={label}>
  <span class={styles.circle} aria-hidden="true"></span>
</span>
