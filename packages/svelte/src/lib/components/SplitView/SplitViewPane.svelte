<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getSplitViewContext } from '../../SplitView/context';

  let {
    id,
    label,
    minSize = 120,
    maxSize = 960,
    defaultSize = 1,
    collapsible = false,
    visible,
    defaultVisible = true,
    onVisibleChange,
    class: className,
    'aria-label': ariaLabel,
    children,
  }: {
    id: string;
    label?: string;
    minSize?: number;
    maxSize?: number;
    defaultSize?: number;
    collapsible?: boolean;
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    class?: string;
    'aria-label'?: string;
    children?: Snippet;
  } = $props();

  const ctx = getSplitViewContext();

  $effect(() => {
    return ctx.registerPane({
      id,
      label,
      minSize,
      maxSize,
      defaultSize,
      collapsible,
      defaultVisible,
      visible,
      onVisibleChange,
      className,
      ariaLabel,
      content: children,
    });
  });
</script>
