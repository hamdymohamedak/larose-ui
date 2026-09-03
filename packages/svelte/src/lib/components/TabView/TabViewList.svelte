<script lang="ts">
  import type { Snippet } from 'svelte';
  import { warnIfTooManyTabs } from '../../TabView/utils';
  import styles from '@larose-ui/styles/components/TabView/TabView.module.css';

  let {
    class: className,
    style,
    'aria-label': listLabel = 'Tabs',
    children,
  }: { class?: string; style?: string; 'aria-label'?: string; children?: Snippet } = $props();

  let el = $state<HTMLUListElement | null>(null);
  $effect(() => {
    if (!el) return;
    warnIfTooManyTabs(el.querySelectorAll('[role="tab"]').length);
  });
</script>

<ul
  bind:this={el}
  class={[styles.tabList, className].filter(Boolean).join(' ')}
  {style}
  role="tablist"
  aria-label={listLabel}
>
  {@render children?.()}
</ul>
