<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Badge/Badge.module.css';

  export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

  interface Props {
    variant?: BadgeVariant;
    children: Snippet;
  }

  let { variant = 'default', children }: Props = $props();
</script>

<span class={styles.badge} data-variant={variant}>
  {@render children()}
</span>
