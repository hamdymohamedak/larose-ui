<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Badge/Badge.module.css';

  export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

  interface Props {
    variant?: BadgeVariant;
    children: Snippet;
    class?: string;
    style?: string;
  }

  let { variant = 'default', children, class: className, style }: Props = $props();
</script>

<span class={[styles.badge, className].filter(Boolean).join(' ')} {style} data-variant={variant}>
  {@render children()}
</span>
