<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    class: className,
    style,
    children,
  }: { class?: string; style?: string; children?: Snippet } = $props();
</script>

<div class={[styles.header, className].filter(Boolean).join(' ')} {style}>
  {@render children?.()}
</div>
