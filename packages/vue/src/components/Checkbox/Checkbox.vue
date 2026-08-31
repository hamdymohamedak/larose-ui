<script setup lang="ts">
import type { Size } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Checkbox/Checkbox.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label: string;
    hint?: string;
    error?: string | null;
    disabled?: boolean;
    boxSize?: Size;
    id?: string;
    class?: string;
    modelValue?: boolean;
  }>(),
  {
    error: null,
    boxSize: 'md',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [event: Event];
}>();

const inputId = props.id ?? props.label.toLowerCase().replace(/\s+/g, '-');
</script>

<template>
  <div :class="styles.wrapper" :data-state="error ? 'error' : 'default'">
    <label :for="inputId" :class="styles.row">
      <input
        :id="inputId"
        type="checkbox"
        :class="cn(styles.input, props.class)"
        :data-size="boxSize"
        :disabled="disabled"
        :checked="modelValue"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        @change="
          emit('update:modelValue', ($event.target as HTMLInputElement).checked);
          emit('change', $event);
        "
      />
      <span :class="styles.label">{{ label }}</span>
    </label>
    <span v-if="hint && !error" :id="`${inputId}-hint`" :class="styles.hint">{{ hint }}</span>
    <span v-if="error" :id="`${inputId}-error`" :class="styles.error" role="alert">{{ error }}</span>
  </div>
</template>
