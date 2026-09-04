<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/DatePicker/datetime-field.module.css';
import { cn } from '../../utils/cn';
import { fieldIdFromLabel } from '../../data-entry/utils';

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    state?: UIState;
    loading?: boolean;
    error?: string | null;
    inputSize?: Size;
    modelValue?: string;
    disabled?: boolean;
    readOnly?: boolean;
    id?: string;
    class?: string;
    style?: CSSProperties;
    min?: string;
    max?: string;
  }>(),
  { loading: false, error: null, inputSize: 'md', modelValue: '' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const inputId = computed(() => props.id ?? (props.label ? fieldIdFromLabel(props.label) : undefined));
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
</script>

<template>
  <div :class="cn(styles.wrapper, props.class)" :style="props.style" :data-state="uiState">
    <label v-if="label" :for="inputId" :class="styles.label">{{ label }}</label>
    <div :class="styles.inputContainer">
      <input
        :id="inputId"
        type="date"
        :class="styles.input"
        :data-size="inputSize"
        :data-state="uiState"
        :value="modelValue"
        :disabled="disabled || uiState === 'disabled' || uiState === 'loading'"
        :readonly="readOnly || uiState === 'readonly'"
        :min="min"
        :max="max"
        :aria-invalid="uiState === 'error'"
        :aria-busy="uiState === 'loading'"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <span v-if="hint && !errorMessage" :id="`${inputId}-hint`" :class="styles.hint">{{ hint }}</span>
    <span v-if="errorMessage" :id="`${inputId}-error`" :class="styles.error" role="alert">{{ errorMessage }}</span>
  </div>
</template>
