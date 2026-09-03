<script setup lang="ts">
import { onMounted, watch } from 'vue';
import type { Size, UIState } from '@larose-ui/core';
import Input from '../Input/Input.vue';

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
    modelValue?: string;
    autocomplete?: string;
    class?: string;
  }>(),
  {
    loading: false,
    error: null,
    required: false,
    inputSize: 'md',
    autocomplete: 'current-password',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

function warnIfPrefilled(value: string | undefined) {
  const isProd =
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') ||
    (typeof import.meta !== 'undefined' &&
      Boolean((import.meta as ImportMeta & { env?: { PROD?: boolean } }).env?.PROD));
  if (isProd) return;
  if (value !== undefined && value !== '') {
    console.warn(
      '[SecureField] Avoid prepopulating password fields. Use biometric or keychain auth instead.',
    );
  }
}

onMounted(() => warnIfPrefilled(props.modelValue));
watch(
  () => props.modelValue,
  (value) => warnIfPrefilled(value),
);
</script>

<template>
  <Input
    type="password"
    :label="label"
    :hint="hint"
    :state="state"
    :loading="loading"
    :error="error"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :input-size="inputSize"
    :id="id"
    :model-value="modelValue"
    :autocomplete="autocomplete"
    :spellcheck="false"
    :class="$props.class"
    @update:model-value="emit('update:modelValue', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>
