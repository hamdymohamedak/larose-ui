<script setup lang="ts">
import DisclosureButton from '../../../packages/vue/src/components/Disclosure/DisclosureButton.vue';
import Input from '../../../packages/vue/src/components/Input/Input.vue';
import Select from '../../../packages/vue/src/components/Select/Select.vue';

withDefaults(
  defineProps<{
    expanded?: boolean;
    defaultExpanded?: boolean;
    label?: string;
  }>(),
  {
    defaultExpanded: false,
    label: 'Save document',
  },
);
</script>

<template>
  <DisclosureButton
    :label="label"
    :expanded="expanded"
    :default-expanded="defaultExpanded"
    aria-label="Show save locations"
  >
    <Input label="Save As" model-value="Quarterly Report" />
    <template #detail>
      <Select
        label="Location"
        model-value="docs"
        :options="[
          { label: 'Documents', value: 'docs' },
          { label: 'Desktop', value: 'desktop' },
          { label: 'iCloud Drive', value: 'icloud' },
        ]"
      />
    </template>
  </DisclosureButton>
</template>
