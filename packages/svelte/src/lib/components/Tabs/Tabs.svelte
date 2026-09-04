<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
  import { cn } from '../../utils/cn';
  import { setTabsContext } from './context';

  interface Props {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    children: Snippet;
    class?: string;
    style?: string;
  }

  let {
    value,
    defaultValue = '',
    onValueChange,
    children,
    class: className,
    style,
  }: Props = $props();

  let internalValue = $state(defaultValue);
  const currentValue = $derived(value !== undefined ? value : internalValue);
  const baseId = `lr-tabs-${Math.random().toString(36).slice(2, 9)}`;

  function handleChange(next: string) {
    if (value === undefined) internalValue = next;
    onValueChange?.(next);
  }

  setTabsContext({
    get value() {
      return currentValue;
    },
    onValueChange: handleChange,
    baseId,
  });
</script>

<div class={cn(styles.tabs, className)} {style}>
  {@render children()}
</div>
