<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
  import { cn } from '../../utils/cn';
  import { getTabsContext } from './context';

  interface Props {
    value: string;
    children: Snippet;
    disabled?: boolean;
    class?: string;
    style?: string;
  }

  let { value, children, disabled, class: className, style }: Props = $props();

  const tabs = getTabsContext('TabsTrigger');
  const selected = $derived(tabs.value === value);
  const tabId = $derived(`${tabs.baseId}-tab-${value}`);
  const panelId = $derived(`${tabs.baseId}-panel-${value}`);
</script>

<button
  type="button"
  id={tabId}
  role="tab"
  class={cn(styles.trigger, className)}
  {style}
  aria-selected={selected}
  aria-controls={panelId}
  tabindex={selected ? 0 : -1}
  data-state={selected ? 'active' : 'inactive'}
  {disabled}
  onclick={() => tabs.onValueChange(value)}
>
  {@render children()}
</button>
