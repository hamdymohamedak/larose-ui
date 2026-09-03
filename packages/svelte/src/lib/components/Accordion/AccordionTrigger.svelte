<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
  import { cn } from '../../utils/cn';
  import { getAccordionContext, getAccordionItemContext } from './context';

  interface Props {
    children: Snippet;
    disabled?: boolean;
    class?: string;
    style?: string;
  }

  let { children, disabled, class: className, style }: Props = $props();

  const itemValue = getAccordionItemContext('AccordionTrigger');
  const accordion = getAccordionContext('AccordionTrigger');
  const isOpen = $derived(accordion.openItems.includes(itemValue));
  const triggerId = $derived(`${accordion.baseId}-trigger-${itemValue}`);
  const panelId = $derived(`${accordion.baseId}-panel-${itemValue}`);
</script>

<button
  type="button"
  id={triggerId}
  class={cn(styles.trigger, className)}
  {style}
  aria-expanded={isOpen}
  aria-controls={panelId}
  data-state={isOpen ? 'open' : 'closed'}
  {disabled}
  onclick={() => accordion.toggleItem(itemValue)}
>
  <span>{@render children()}</span>
  <span class={styles.icon} aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
</button>
