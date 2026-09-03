<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    class: className,
    style,
    'aria-label': ariaLabel = 'Sidebar navigation',
    children,
  }: { class?: string; style?: string; 'aria-label'?: string; children?: Snippet } = $props();
</script>

<nav class={[styles.nav, className].filter(Boolean).join(' ')} {style} aria-label={ariaLabel}>
  {@render children?.()}
</nav>
