<script setup lang="ts">
import Tabs from '../../../packages/vue/src/components/Tabs/Tabs.vue';
import TabsList from '../../../packages/vue/src/components/Tabs/TabsList.vue';
import TabsTrigger from '../../../packages/vue/src/components/Tabs/TabsTrigger.vue';
import TabsPanel from '../../../packages/vue/src/components/Tabs/TabsPanel.vue';

withDefaults(
  defineProps<{
    defaultValue?: string;
  }>(),
  { defaultValue: 'profile' },
);
</script>

<template>
  <Tabs :default-value="defaultValue">
    <TabsList aria-label="Employee sections">
      <TabsTrigger value="profile">Profile</TabsTrigger>
      <TabsTrigger value="permissions">Permissions</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
    </TabsList>
    <TabsPanel value="profile">Profile details and contact info.</TabsPanel>
    <TabsPanel value="permissions">Role and permission assignments.</TabsPanel>
    <TabsPanel value="activity">Recent audit events.</TabsPanel>
  </Tabs>
</template>
