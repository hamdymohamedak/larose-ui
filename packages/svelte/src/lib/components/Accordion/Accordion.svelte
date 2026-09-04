<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
  import { cn } from '../../utils/cn';
  import { setAccordionContext } from './context';

  interface Props {
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    children: Snippet;
    class?: string;
    style?: string;
  }

  let {
    type = 'single',
    collapsible = false,
    value,
    defaultValue = [],
    onValueChange,
    children,
    class: className,
    style,
  }: Props = $props();

  let internalValue = $state<string[]>([...defaultValue]);
  const openItems = $derived(value !== undefined ? value : internalValue);
  const baseId = `lr-accordion-${Math.random().toString(36).slice(2, 9)}`;

  function toggleItem(itemValue: string) {
    const next = new Set(openItems);
    const isOpen = next.has(itemValue);

    if (type === 'single') {
      next.clear();
      if (!isOpen || !collapsible) next.add(itemValue);
    } else if (isOpen) {
      next.delete(itemValue);
    } else {
      next.add(itemValue);
    }

    const nextValue = Array.from(next);
    if (value === undefined) internalValue = nextValue;
    onValueChange?.(nextValue);
  }

  setAccordionContext({
    get type() {
      return type;
    },
    get collapsible() {
      return collapsible;
    },
    get openItems() {
      return openItems;
    },
    toggleItem,
    baseId,
  });
</script>

<div class={cn(styles.accordion, className)} {style}>
  {@render children()}
</div>
