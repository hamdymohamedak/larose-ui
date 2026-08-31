<script setup lang="ts">
import { computed } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Textarea/Textarea.module.css';
import { cn } from '../../utils/cn';
import { fieldIdFromLabel } from '../../data-entry/utils';
import FieldShell from '../FieldShell/FieldShell.vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    state?: UIState;
    loading?: boolean;
    error?: string | null;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    inputSize?: Size;
    id?: string;
    rows?: number;
    modelValue?: string;
    class?: string;
  }>(),
  {
    loading: false,
    error: null,
    required: false,
    inputSize: 'md',
    rows: 4,
  },
);

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
      <textarea
        :id="inputId"
        :rows="rows"
        :class="cn(styles.textarea, props.class)"
        :data-size="inputSize"
        :data-state="uiState"
        :value="modelValue"
        :disabled="disabled || uiState === 'disabled'"
        :readonly="readOnly || uiState === 'readonly'"
        :required="required"
        :aria-invalid="uiState === 'error'"
        :aria-busy="uiState === 'loading'"
        :aria-describedby="
          errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        "
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
      <span v-if="uiState === 'loading'" :class="styles.loadingIndicator" aria-hidden="true" />
    </div>
  </FieldShell>
</template>
