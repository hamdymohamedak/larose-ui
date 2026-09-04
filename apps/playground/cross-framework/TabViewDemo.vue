<script setup lang="ts">
import TabView from '../../../packages/vue/src/components/TabView/TabView.vue';
import TabViewList from '../../../packages/vue/src/components/TabView/TabViewList.vue';
import TabViewTab from '../../../packages/vue/src/components/TabView/TabViewTab.vue';
import TabViewPanel from '../../../packages/vue/src/components/TabView/TabViewPanel.vue';
import type { TabViewVariant } from '../../../packages/vue/src/TabView/types';

withDefaults(
  defineProps<{
    variant?: TabViewVariant;
    defaultValue?: string;
    showTabs?: boolean;
    inset?: boolean;
  }>(),
  {
    variant: 'bordered',
    defaultValue: 'general',
    showTabs: true,
    inset: true,
  },
);
</script>

<template>
  <TabView
    :variant="variant"
    :default-value="defaultValue"
    :show-tabs="showTabs"
    :inset="inset"
    aria-label="Settings tabs"
  >
    <template #list>
      <TabViewList aria-label="Settings sections">
        <TabViewTab value="general" label="General" />
        <TabViewTab value="privacy" label="Privacy" />
        <TabViewTab value="notifications" label="Notifications" />
      </TabViewList>
    </template>
    <TabViewPanel value="general">Choose appearance and update channel.</TabViewPanel>
    <TabViewPanel value="privacy">Manage analytics and data sharing.</TabViewPanel>
    <TabViewPanel value="notifications">Configure badges and sounds.</TabViewPanel>
  </TabView>
</template>
