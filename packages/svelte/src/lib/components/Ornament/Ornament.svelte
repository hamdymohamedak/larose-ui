<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';
  import { cn } from '../../utils/cn';

  let {
    children,
    class: className,
    style,
  }: {
    children?: Snippet;
    class?: string;
    style?: string;
  } = $props();
</script>

<div class={cn(styles.ornament, className)} {style} role="toolbar">
  <div class={styles.ornamentInner}>
    {#if children}{@render children()}{/if}
  </div>
</div>
