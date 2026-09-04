<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getToolbarPlatform } from '../../Toolbar/context';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    class: className,
    style,
    children,
  }: { class?: string; style?: string; children?: Snippet } = $props();

  const platform = $derived(getToolbarPlatform());
</script>

<div class={[styles.group, className].filter(Boolean).join(' ')} {style} data-platform={platform} role="group">
  {@render children?.()}
</div>
