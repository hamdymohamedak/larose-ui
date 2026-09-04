<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
  import { cn } from '../../utils/cn';
  import { getAccordionContext, getAccordionItemContext } from './context';

  interface Props {
    children: Snippet;
    class?: string;
    style?: string;
  }

  let { children, class: className, style }: Props = $props();

  const itemValue = getAccordionItemContext('AccordionContent');
  const accordion = getAccordionContext('AccordionContent');
  const isOpen = $derived(accordion.openItems.includes(itemValue));
  const triggerId = $derived(`${accordion.baseId}-trigger-${itemValue}`);
  const panelId = $derived(`${accordion.baseId}-panel-${itemValue}`);
</script>

{#if isOpen}
  <div
    id={panelId}
    role="region"
    class={cn(styles.content, className)}
    {style}
    aria-labelledby={triggerId}
    data-state="open"
  >
    {@render children()}
  </div>
{/if}
