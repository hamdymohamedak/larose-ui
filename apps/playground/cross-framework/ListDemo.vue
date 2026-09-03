<script setup lang="ts">
import List from '../../../packages/vue/src/components/ListTable/List.vue';
import ListSection from '../../../packages/vue/src/components/ListTable/ListSection.vue';
import ListRow from '../../../packages/vue/src/components/ListTable/ListRow.vue';

withDefaults(
  defineProps<{
    variant?: 'grouped' | 'plain';
  }>(),
  { variant: 'grouped' },
);
</script>

<template>
  <List :variant="variant" aria-label="Settings">
    <ListSection header="Account" footer="Changes sync across your devices.">
      <ListRow title="Apple ID" subtitle="sara@icloud.com" accessory="disclosure" />
      <ListRow title="iCloud" subtitle="5 GB of 5 GB used" accessory="disclosure" />
    </ListSection>
    <ListSection header="Notifications">
      <ListRow title="Allow Notifications" accessory="checkmark" selected />
      <ListRow title="Sounds" accessory="disclosure" />
    </ListSection>
  </List>
</template>
