<script lang="ts">
  import Sidebar from '../../../packages/svelte/src/lib/components/Sidebar/Sidebar.svelte';
  import SidebarHeader from '../../../packages/svelte/src/lib/components/Sidebar/SidebarHeader.svelte';
  import SidebarNav from '../../../packages/svelte/src/lib/components/Sidebar/SidebarNav.svelte';
  import SidebarGroup from '../../../packages/svelte/src/lib/components/Sidebar/SidebarGroup.svelte';
  import SidebarItem from '../../../packages/svelte/src/lib/components/Sidebar/SidebarItem.svelte';

  let { brand = 'laRose' }: { brand?: string } = $props();
</script>

<div style="display: flex; min-height: 320px; border: 1px solid var(--lr-color-border, #e4e4e7)">
  <Sidebar>
    <SidebarHeader>{brand}</SidebarHeader>
    <SidebarNav>
      <SidebarGroup label="Workspace">
        <SidebarItem active>Dashboard</SidebarItem>
        <SidebarItem>Employees</SidebarItem>
        <SidebarItem>Reports</SidebarItem>
      </SidebarGroup>
      <SidebarGroup label="Settings">
        <SidebarItem>Profile</SidebarItem>
        <SidebarItem disabled>Billing</SidebarItem>
      </SidebarGroup>
    </SidebarNav>
  </Sidebar>
  <div style="flex: 1; padding: 1rem">Main content</div>
</div>
