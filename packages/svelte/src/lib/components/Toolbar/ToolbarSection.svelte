<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ToolbarSectionPlacement } from '../../Toolbar/types';
  import { getToolbarPlatform } from '../../Toolbar/context';
  import { shouldUseSystemOverflow } from '../../Toolbar/utils';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    placement,
    collapsible = placement === 'center',
    class: className,
    style,
    children,
  }: {
    placement: ToolbarSectionPlacement;
    collapsible?: boolean;
    class?: string;
    style?: string;
    children?: Snippet;
  } = $props();

  const platform = $derived(getToolbarPlatform());
  const sectionClass = $derived(
    placement === 'leading' ? styles.leading : placement === 'center' ? styles.center : styles.trailing,
  );
</script>

<div class={[sectionClass, className].filter(Boolean).join(' ')} {style}>
  <div class={placement === 'center' ? styles.centerInner : undefined}>
    {@render children?.()}
  </div>
</div>
