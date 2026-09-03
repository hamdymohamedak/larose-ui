<script setup lang="ts">
import DisclosureTriangle from '../../../packages/vue/src/components/Disclosure/DisclosureTriangle.vue';
import Input from '../../../packages/vue/src/components/Input/Input.vue';

withDefaults(
  defineProps<{
    label?: string;
    defaultExpanded?: boolean;
  }>(),
  {
    label: 'Delivery details',
    defaultExpanded: true,
  },
);
</script>

<template>
  <DisclosureTriangle :label="label" :default-expanded="defaultExpanded">
    <Input label="Recipient" model-value="sara@company.com" />
    <Input label="Notes" model-value="Leave at front desk" />
  </DisclosureTriangle>
</template>
