<script lang="ts">
  import TabView from '../../../packages/svelte/src/lib/components/TabView/TabView.svelte';
  import TabViewList from '../../../packages/svelte/src/lib/components/TabView/TabViewList.svelte';
  import TabViewTab from '../../../packages/svelte/src/lib/components/TabView/TabViewTab.svelte';
  import TabViewPanel from '../../../packages/svelte/src/lib/components/TabView/TabViewPanel.svelte';
  import type { TabViewVariant } from '../../../packages/svelte/src/lib/TabView/types';

  let {
    variant = 'bordered' as TabViewVariant,
    defaultValue = 'general',
    showTabs = true,
    inset = true,
  }: {
    variant?: TabViewVariant;
    defaultValue?: string;
    showTabs?: boolean;
    inset?: boolean;
  } = $props();
</script>

<TabView {variant} {defaultValue} {showTabs} {inset} aria-label="Settings tabs">
  {#snippet list()}
    <TabViewList aria-label="Settings sections">
      <TabViewTab value="general" label="General" />
      <TabViewTab value="privacy" label="Privacy" />
      <TabViewTab value="notifications" label="Notifications" />
    </TabViewList>
  {/snippet}
  {#snippet panels()}
    <TabViewPanel value="general">Choose appearance and update channel.</TabViewPanel>
    <TabViewPanel value="privacy">Manage analytics and data sharing.</TabViewPanel>
    <TabViewPanel value="notifications">Configure badges and sounds.</TabViewPanel>
  {/snippet}
</TabView>
