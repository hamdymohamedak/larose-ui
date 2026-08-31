<script setup lang="ts">
import { computed } from 'vue';
import type { UIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Progress/Progress.module.css';

export type ProgressVariant = 'default' | 'success' | 'error';

const props = withDefaults(
  defineProps<{
    value: number;
    max?: number;
    label?: string;
    variant?: ProgressVariant;
    state?: UIState;
    showValue?: boolean;
  }>(),
  {
    max: 100,
    variant: 'default',
    state: 'idle',
    showValue: false,
  },
);

const clamped = computed(() => Math.min(props.max, Math.max(0, props.value)));
const percent = computed(() => (props.max > 0 ? Math.round((clamped.value / props.max) * 100) : 0));
</script>

<template>
  <div :class="styles.wrapper" :data-state="state">
    <div v-if="label || showValue" :class="styles.header">
      <span v-if="label" :class="styles.label">{{ label }}</span>
      <span v-if="showValue" :class="styles.value">{{ percent }}%</span>
    </div>
    <div
      :class="styles.track"
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="clamped"
      :aria-label="label"
      :data-variant="variant"
      :data-state="state"
    >
      <div :class="styles.bar" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
