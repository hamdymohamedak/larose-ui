<script setup lang="ts">
import { computed, useId, type CSSProperties } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/DatePicker/datetime-field.module.css';
import { cn } from '../../utils/cn';

export interface DateRange {
  startDate: string;
  endDate: string;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    startLabel?: string;
    endLabel?: string;
    hint?: string;
    state?: UIState;
    loading?: boolean;
    error?: string | null;
    inputSize?: Size;
    modelValue?: DateRange;
    min?: string;
    max?: string;
    disabled?: boolean;
    readOnly?: boolean;
    class?: string;
    style?: CSSProperties;
    id?: string;
  }>(),
  {
    startLabel: 'Start date',
    endLabel: 'End date',
    loading: false,
    error: null,
    inputSize: 'md',
    modelValue: () => ({ startDate: '', endDate: '' }),
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: DateRange] }>();
const generatedId = useId();
const groupId = computed(() => props.id ?? generatedId);
const uiState = computed(() =>
  resolveUIState({
    state: props.state,
    loading: props.loading,
    error: props.error,
    disabled: props.disabled,
    readonly: props.readOnly,
  }),
);
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : null));

function update(partial: Partial<DateRange>) {
  emit('update:modelValue', { ...props.modelValue!, ...partial });
}
</script>

<template>
  <fieldset :class="cn(styles.wrapper, props.class)" :style="props.style" :data-state="uiState">
    <legend v-if="label" :class="styles.label">{{ label }}</legend>
    <div :class="styles.range">
      <div :class="styles.rangeField">
        <label :for="`${groupId}-start`" :class="styles.label">{{ startLabel }}</label>
        <div :class="styles.inputContainer">
          <input
            :id="`${groupId}-start`"
            type="date"
            :class="styles.input"
            :data-size="inputSize"
            :value="modelValue?.startDate"
            :disabled="disabled || uiState === 'disabled'"
            :readonly="readOnly"
            :min="min"
            :max="modelValue?.endDate || max"
            @input="update({ startDate: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>
      <div :class="styles.rangeField">
        <label :for="`${groupId}-end`" :class="styles.label">{{ endLabel }}</label>
        <div :class="styles.inputContainer">
          <input
            :id="`${groupId}-end`"
            type="date"
            :class="styles.input"
            :data-size="inputSize"
            :value="modelValue?.endDate"
            :disabled="disabled || uiState === 'disabled'"
            :readonly="readOnly"
            :min="modelValue?.startDate || min"
            :max="max"
            @input="update({ endDate: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>
    </div>
    <span v-if="hint && !errorMessage" :class="styles.hint">{{ hint }}</span>
    <span v-if="errorMessage" :class="styles.error" role="alert">{{ errorMessage }}</span>
  </fieldset>
</template>
