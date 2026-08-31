<script setup lang="ts">
import { computed } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Select/Select.module.css';
import { cn } from '../../utils/cn';
import { fieldIdFromLabel } from '../../data-entry/utils';
import FieldShell from '../FieldShell/FieldShell.vue';
import Spinner from '../Spinner/Spinner.vue';

export interface SelectOption {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
    state?: UIState;
    loading?: boolean;
    error?: string | null;
    disabled?: boolean;
    required?: boolean;
    inputSize?: Size;
    id?: string;
    modelValue?: string;
    class?: string;
  }>(),
  {
    placeholder: 'Select...',
    loading: false,
    error: null,
    required: false,
    inputSize: 'md',
  },
);

const inputId = computed(() => props.id ?? (props.label ? fieldIdFromLabel(props.label) : undefined));

const uiState = computed(() =>
  resolveUIState({
    state: props.state,
    loading: props.loading,
    error: props.error,
    disabled: props.disabled,
  }),
);

const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : null));

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <FieldShell
    :label="label"
    :hint="hint"
    :error="errorMessage"
    :required="required"
    :html-for="inputId"
    :ui-state="uiState"
  >
    <div :class="styles.inputContainer">
      <select
        :id="inputId"
        :class="cn(styles.select, props.class)"
        :data-size="inputSize"
        :data-state="uiState"
        :value="modelValue"
        :disabled="disabled || uiState === 'disabled'"
        :required="required"
        :aria-invalid="uiState === 'error'"
        :aria-busy="uiState === 'loading'"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span v-if="uiState === 'loading'" :class="styles.loadingIndicator" aria-hidden="true">
        <Spinner size="sm" />
      </span>
    </div>
  </FieldShell>
</template>
