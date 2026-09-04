<script lang="ts">
  import Tabs from '../../../packages/svelte/src/lib/components/Tabs/Tabs.svelte';
  import TabsList from '../../../packages/svelte/src/lib/components/Tabs/TabsList.svelte';
  import TabsTrigger from '../../../packages/svelte/src/lib/components/Tabs/TabsTrigger.svelte';
  import TabsPanel from '../../../packages/svelte/src/lib/components/Tabs/TabsPanel.svelte';

  let { defaultValue = 'profile' }: { defaultValue?: string } = $props();
</script>

<Tabs {defaultValue}>
  <TabsList aria-label="Employee sections">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="permissions">Permissions</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsPanel value="profile">Profile details and contact info.</TabsPanel>
  <TabsPanel value="permissions">Role and permission assignments.</TabsPanel>
  <TabsPanel value="activity">Recent audit events.</TabsPanel>
</Tabs>
