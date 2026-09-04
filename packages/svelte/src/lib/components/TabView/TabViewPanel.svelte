<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getTabViewContext } from '../../TabView/context';
  import styles from '@larose-ui/styles/components/TabView/TabView.module.css';

  let {
    value,
    class: className,
    style,
    children,
  }: { value: string; class?: string; style?: string; children?: Snippet } = $props();

  const ctx = $derived(getTabViewContext('TabViewPanel'));
  const selected = $derived(ctx.value === value);
</script>

{#if selected}
  <div
    id={`${ctx.baseId}-panel-${value}`}
    role="tabpanel"
    class={[styles.panel, className].filter(Boolean).join(' ')}
    {style}
    aria-labelledby={`${ctx.baseId}-tab-${value}`}
    tabindex={0}
  >
    {@render children?.()}
  </div>
{/if}
