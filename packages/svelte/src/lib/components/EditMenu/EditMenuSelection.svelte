<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/EditMenu/EditMenu.module.css';
  import { cn } from '../../utils/cn';

  let {
    selected = false,
    class: className,
    children,
    ...rest
  }: {
    selected?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<div
  class={cn(styles.selectionPreview, className)}
  data-selected={selected ? 'true' : undefined}
  {...rest}
>
  {@render children?.()}
</div>
