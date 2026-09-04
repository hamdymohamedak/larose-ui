<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/DockMenu/DockMenu.module.css';
  import { cn } from '../../utils/cn';

  let {
    children,
    class: className,
    style,
    'aria-label': ariaLabel = 'Dock',
  }: {
    children?: Snippet;
    class?: string;
    style?: string;
    'aria-label'?: string;
  } = $props();
</script>

<div class={cn(styles.dockBar, className)} {style} role="toolbar" aria-label={ariaLabel}>
  {#if children}{@render children()}{/if}
</div>
