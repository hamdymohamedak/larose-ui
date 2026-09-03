<script setup lang="ts">
import { computed } from 'vue';
import type { PickerColumn, PickerValue } from '../../Picker/types';
import { columnsFromValues } from '../../Picker/utils';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
import { cn } from '../../utils/cn';
import WheelColumn from './WheelColumn.vue';

const props = withDefaults(
  defineProps<{
    columns: PickerColumn[];
    modelValue?: PickerValue;
    value?: PickerValue;
    disabled?: boolean;
    inline?: boolean;
    compact?: boolean;
    class?: string;
    style?: Record<string, string | number>;
    'aria-label'?: string;
  }>(),
  {
    disabled: false,
    inline: false,
    compact: false,
    'aria-label': 'Picker',
  },
);

const emit = defineEmits<{
  'update:modelValue': [PickerValue];
  change: [PickerValue];
}>();

const current = computed(() => props.modelValue ?? props.value ?? {});
const resolvedColumns = computed(() => columnsFromValues(props.columns, current.value));

function onColumnChange(columnId: string, next: string) {
  const value = { ...current.value, [columnId]: next };
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<template>
  <div
    :class="
      cn(
        styles.wheels,
        inline ? styles.wheelsInline : undefined,
        compact ? styles.wheelsCompact : undefined,
        props.class,
      )
    "
    :style="props.style"
    role="group"
    :aria-label="props['aria-label']"
  >
    <WheelColumn
      v-for="column in resolvedColumns"
      :key="column.id"
      :id="column.id"
      :label="column.label"
      :options="column.options"
      :model-value="current[column.id] ?? column.options[0]?.value ?? ''"
      :disabled="disabled"
      :column-flex="column.flex"
      @change="onColumnChange(column.id, $event)"
    />
  </div>
</template>
