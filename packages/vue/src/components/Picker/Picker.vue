<script setup lang="ts">
import { computed, useId } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { fieldIdFromLabel } from '../../data-entry/utils';
import type { PickerColumn, PickerStyle, PickerValue } from '../../Picker/types';
import { resolvePickerChrome } from '../../Picker/chrome';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
import { cn } from '../../utils/cn';
import FieldShell from '../FieldShell/FieldShell.vue';
import Popover from '../Popover/Popover.vue';
import WheelPicker from './WheelPicker.vue';

const props = withDefaults(
  defineProps<{
    columns: PickerColumn[];
    modelValue?: PickerValue;
    value?: PickerValue;
    appearance?: PickerStyle;
    style?: PickerStyle | Record<string, string | number>;
    label?: string;
    hint?: string;
    error?: string | null;
    state?: UIState;
    loading?: boolean;
    disabled?: boolean;
    inputSize?: Size;
    placeholder?: string;
    formatValue?: (value: PickerValue, columns: PickerColumn[]) => string;
    class?: string;
    'aria-label'?: string;
  }>(),
  {
    error: null,
    loading: false,
    disabled: false,
    placeholder: 'Select',
  },
);

const emit = defineEmits<{
  'update:modelValue': [PickerValue];
  change: [PickerValue];
}>();

const chrome = computed(() =>
  resolvePickerChrome(props.appearance, props.style as PickerStyle | Record<string, string | number> | undefined, 'wheels'),
);
const fieldId = useId();
const inputId = computed(() => (props.label ? fieldIdFromLabel(props.label) : fieldId));
const uiState = computed(() =>
  resolveUIState({
    state: props.state,
    loading: props.loading,
    error: props.error,
    disabled: props.disabled,
  }),
);
const current = computed(() => props.modelValue ?? props.value ?? {});
const isDisabled = computed(
  () => props.disabled || uiState.value === 'disabled' || uiState.value === 'loading',
);
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : null));

function defaultFormat(value: PickerValue, columns: PickerColumn[]) {
  return columns
    .map((column) => {
      const selected = column.options.find((option) => option.value === value[column.id]);
      return selected?.label ?? value[column.id];
    })
    .filter(Boolean)
    .join(' ');
}

const displayLabel = computed(() => {
  const formatted = (props.formatValue ?? defaultFormat)(current.value, props.columns).trim();
  return formatted || props.placeholder;
});

function onChange(next: PickerValue) {
  emit('update:modelValue', next);
  emit('change', next);
}
</script>

<template>
  <FieldShell
    :label="label"
    :hint="hint"
    :error="errorMessage"
    :html-for="inputId"
    :ui-state="uiState"
    :class="props.class"
    :style="chrome.css"
  >
    <div v-if="chrome.appearance === 'compact'" :class="styles.compactField">
      <Popover
        side="bottom"
        :aria-label="props['aria-label'] ?? label ?? 'Picker'"
        :panel-class="styles.compactPopover"
      >
        <template #trigger>
          <button
            :id="inputId"
            type="button"
            :class="styles.compactTrigger"
            :disabled="isDisabled"
            aria-haspopup="dialog"
          >
            <span :class="styles.compactValue">{{ displayLabel }}</span>
            <span :class="styles.compactChevron" aria-hidden="true">▾</span>
          </button>
        </template>
        <template #content>
          <div :class="styles.popoverPanelWheels">
            <WheelPicker
              :columns="columns"
              :model-value="current"
              compact
              :disabled="isDisabled"
              :aria-label="props['aria-label'] ?? label ?? 'Picker'"
              @change="onChange"
            />
          </div>
        </template>
      </Popover>
    </div>
    <div v-else :class="cn(styles.picker)">
      <WheelPicker
        :columns="columns"
        :model-value="current"
        :disabled="isDisabled"
        :aria-label="props['aria-label'] ?? label ?? 'Picker'"
        @change="onChange"
      />
    </div>
  </FieldShell>
</template>
