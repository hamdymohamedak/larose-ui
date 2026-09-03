<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
  import { cn } from '../../utils/cn';
  import { getAccordionContext, setAccordionItemContext } from './context';

  interface Props {
    value: string;
    children: Snippet;
    disabled?: boolean;
    class?: string;
    style?: string;
  }

  let { value, children, disabled, class: className, style }: Props = $props();

  const accordion = getAccordionContext('AccordionItem');
  const isOpen = $derived(accordion.openItems.includes(value));

  setAccordionItemContext(value);
</script>

<div
  class={cn(styles.item, className)}
  {style}
  data-state={isOpen ? 'open' : 'closed'}
  data-disabled={disabled ? 'true' : undefined}
>
  {@render children()}
</div>
