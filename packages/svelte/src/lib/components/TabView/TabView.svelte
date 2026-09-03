<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TabViewVariant } from '../../TabView/types';
  import { setTabViewContext } from '../../TabView/context';
  import styles from '@larose-ui/styles/components/TabView/TabView.module.css';

  let {
    value,
    defaultValue = '',
    onValueChange,
    variant = 'bordered',
    showTabs = true,
    inset = true,
    class: className,
    style,
    'aria-label': ariaLabel = 'Tab view',
    children,
    list,
    panels,
  }: {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    variant?: TabViewVariant;
    showTabs?: boolean;
    inset?: boolean;
    class?: string;
    style?: string;
    'aria-label'?: string;
    children?: Snippet;
    list?: Snippet;
    panels?: Snippet;
  } = $props();

  let internal = $state(defaultValue);
  const current = $derived(value ?? internal);
  const baseId = $props.id();

  setTabViewContext(() => ({
    value: current,
    onValueChange(next: string) {
      if (value === undefined) internal = next;
      onValueChange?.(next);
    },
    baseId,
  }));
</script>

<div
  class={[styles.tabView, className].filter(Boolean).join(' ')}
  {style}
  data-variant={variant}
  data-inset={inset ? 'true' : undefined}
  aria-label={ariaLabel}
>
  {#if showTabs}
    {@render list?.()}
  {/if}
  <div class={styles.content}>{@render panels?.()}{@render children?.()}</div>
</div>
