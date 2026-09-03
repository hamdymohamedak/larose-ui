<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Input/Input.module.css';
import { useComponentDefaults } from '../../composables/useComponentDefaults';
import { cn } from '../../utils/cn';
import { fieldIdFromLabel } from '../../data-entry/utils';
import FieldShell from '../FieldShell/FieldShell.vue';
import Spinner from '../Spinner/Spinner.vue';

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
    type?: string;
    modelValue?: string;
    autocomplete?: string;
    spellcheck?: boolean;
    class?: string;
  }>(),
  {
    loading: false,
    error: null,
    required: false,
    inputSize: 'md',
    type: 'text',
  },
);

const merged = useComponentDefaults('Input', props);
const focused = ref(false);

const inputId = computed(() => merged.id ?? (merged.label ? fieldIdFromLabel(merged.label) : undefined));

const uiState = computed(() =>
  resolveUIState({
    state: merged.state,
    loading: merged.loading,
    error: merged.error,
    disabled: merged.disabled,
    readonly: merged.readOnly,
  }),
);

const errorMessage = computed(() =>
  typeof merged.error === 'string' ? merged.error : null,
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();
</script>

<template>
  <FieldShell
    :label="merged.label"
    :hint="merged.hint"
    :error="errorMessage"
    :required="merged.required"
    :html-for="inputId"
    :ui-state="uiState"
  >
    <div :class="styles.inputContainer">
      <div
        :class="styles.inputShell"
        :data-size="merged.inputSize"
        :data-state="uiState"
        :data-focused="focused ? 'true' : undefined"
      >
        <input
          :id="inputId"
          :type="merged.type"
          :autocomplete="merged.autocomplete"
          :spellcheck="merged.spellcheck"
          :class="cn(styles.input, merged.class)"
          :data-size="merged.inputSize"
          :value="modelValue"
          :disabled="merged.disabled || uiState === 'disabled'"
          :readonly="merged.readOnly || uiState === 'readonly'"
          :required="merged.required"
          :aria-invalid="uiState === 'error'"
          :aria-busy="uiState === 'loading'"
          :aria-describedby="
            errorMessage ? `${inputId}-error` : merged.hint ? `${inputId}-hint` : undefined
          "
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @focus="
            focused = true;
            emit('focus', $event);
          "
          @blur="
            focused = false;
            emit('blur', $event);
          "
        />
        <span v-if="uiState === 'loading'" :class="styles.loadingIndicator" aria-hidden="true">
          <Spinner size="sm" />
        </span>
      </div>
    </div>
  </FieldShell>
</template>
