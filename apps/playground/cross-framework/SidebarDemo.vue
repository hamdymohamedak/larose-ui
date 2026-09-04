<script setup lang="ts">
import Sidebar from '../../../packages/vue/src/components/Sidebar/Sidebar.vue';
import SidebarHeader from '../../../packages/vue/src/components/Sidebar/SidebarHeader.vue';
import SidebarNav from '../../../packages/vue/src/components/Sidebar/SidebarNav.vue';
import SidebarGroup from '../../../packages/vue/src/components/Sidebar/SidebarGroup.vue';
import SidebarItem from '../../../packages/vue/src/components/Sidebar/SidebarItem.vue';

withDefaults(
  defineProps<{
    brand?: string;
  }>(),
  { brand: 'laRose' },
);
</script>

<template>
  <div style="display: flex; min-height: 320px; border: 1px solid var(--lr-color-border, #e4e4e7)">
    <Sidebar>
      <SidebarHeader>{{ brand }}</SidebarHeader>
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
</template>
