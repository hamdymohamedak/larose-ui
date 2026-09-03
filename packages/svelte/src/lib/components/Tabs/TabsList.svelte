<script lang="ts">
  import type { Snippet } from 'svelte';
  import { handleTabListKeyDown } from '@larose-ui/primitives';
  import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
  import { cn } from '../../utils/cn';
  import { getTabsContext } from './context';

  interface Props {
    children: Snippet;
    class?: string;
    style?: string;
    'aria-label'?: string;
  }

  let {
    children,
    class: className,
    style,
    'aria-label': ariaLabel = 'Tabs',
  }: Props = $props();

  const tabs = getTabsContext('TabsList');

  function onKeyDown(event: KeyboardEvent) {
    handleTabListKeyDown(event, event.currentTarget as HTMLElement, {
      activeValue: tabs.value,
      onValueChange: tabs.onValueChange,
    });
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class={cn(styles.list, className)}
  {style}
  role="tablist"
  aria-label={ariaLabel}
  onkeydown={onKeyDown}
>
  {@render children()}
</div>
