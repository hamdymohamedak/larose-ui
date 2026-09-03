<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createTabIds, isTabSelected } from '@larose-ui/primitives';
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
  const selected = $derived(isTabSelected(tabs.value, value));
  const ids = $derived(createTabIds(tabs.baseId, value));
</script>

{#if selected}
  <div
    id={ids.panelId}
    role="tabpanel"
    class={cn(styles.panel, className)}
    {style}
    aria-labelledby={ids.tabId}
    tabindex="0"
  >
    {@render children()}
  </div>
{/if}
