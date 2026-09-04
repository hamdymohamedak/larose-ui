<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createTabIds, isTabSelected } from '@larose-ui/primitives';
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
  const selected = $derived(isTabSelected(tabs.value, value));
  const ids = $derived(createTabIds(tabs.baseId, value));
</script>

<button
  type="button"
  id={ids.tabId}
  role="tab"
  class={cn(styles.trigger, className)}
  {style}
  aria-selected={selected}
  aria-controls={ids.panelId}
  tabindex={selected ? 0 : -1}
  data-state={selected ? 'active' : 'inactive'}
  data-value={value}
  {disabled}
  onclick={() => tabs.onValueChange(value)}
>
  {@render children()}
</button>
