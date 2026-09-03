<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
  import { cn } from '../../utils/cn';
  import { getTabsContext } from './context';

  interface Props {
    value: string;
    children: Snippet;
    class?: string;
    style?: string;
  }

  let { value, children, class: className, style }: Props = $props();

  const tabs = getTabsContext('TabsPanel');
  const selected = $derived(tabs.value === value);
  const tabId = $derived(`${tabs.baseId}-tab-${value}`);
  const panelId = $derived(`${tabs.baseId}-panel-${value}`);
</script>

{#if selected}
  <div
    id={panelId}
    role="tabpanel"
    class={cn(styles.panel, className)}
    {style}
    aria-labelledby={tabId}
    tabindex="0"
  >
    {@render children()}
  </div>
{/if}
