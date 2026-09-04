<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ListVariant } from '../../ListTable/types';
  import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

  let {
    variant = 'grouped',
    class: className,
    style,
    'aria-label': ariaLabel,
    children,
  }: { variant?: ListVariant; class?: string; style?: string; 'aria-label'?: string; children?: Snippet } = $props();
</script>

<div class={[styles.list, className].filter(Boolean).join(' ')} {style} data-variant={variant} role="list" aria-label={ariaLabel}>
  {@render children?.()}
</div>
