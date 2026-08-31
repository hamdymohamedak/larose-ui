<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Size } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Switch/Switch.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label: string;
    modelValue?: boolean;
    defaultChecked?: boolean;
    hint?: string;
    disabled?: boolean;
    switchSize?: Size;
    id?: string;
    class?: string;
  }>(),
  {
    switchSize: 'md',
    defaultChecked: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const inputId = props.id ?? props.label.toLowerCase().replace(/\s+/g, '-');
const uncontrolled = ref(props.defaultChecked);
const isControlled = computed(() => props.modelValue !== undefined);
const isOn = computed(() => (isControlled.value ? props.modelValue : uncontrolled.value) ?? false);

function handleClick() {
  if (props.disabled) return;
  const next = !isOn.value;
  if (!isControlled.value) uncontrolled.value = next;
  emit('update:modelValue', next);
}
</script>

<template>
  <div :class="styles.wrapper">
    <div :class="styles.row">
      <button
        :id="inputId"
        type="button"
        role="switch"
        :aria-checked="isOn"
        :aria-label="label"
        :aria-describedby="hint ? `${inputId}-hint` : undefined"
        :class="cn(styles.track, props.class)"
        :data-size="switchSize"
        :data-state="isOn ? 'on' : 'off'"
        :disabled="disabled"
        @click="handleClick"
      >
        <span :class="styles.thumb" aria-hidden="true" />
      </button>
      <span :class="styles.label">{{ label }}</span>
    </div>
    <span v-if="hint" :id="`${inputId}-hint`" :class="styles.hint">{{ hint }}</span>
  </div>
</template>
