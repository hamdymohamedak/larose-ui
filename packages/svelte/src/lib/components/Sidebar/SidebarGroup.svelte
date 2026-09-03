<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    label,
    class: className,
    style,
    children,
  }: { label: string; class?: string; style?: string; children?: Snippet } = $props();
</script>

<div class={className} {style} role="group" aria-label={label}>
  <div class={styles.groupLabel}>{label}</div>
  {@render children?.()}
</div>
