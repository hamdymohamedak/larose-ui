<script setup lang="ts">
import type { UIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/DataEntry/FieldShell.module.css';

withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    error?: string | null;
    required?: boolean;
    htmlFor?: string;
    uiState?: UIState;
  }>(),
  {
    required: false,
    uiState: 'idle',
    error: null,
  },
);
</script>

<template>
  <div :class="styles.wrapper" :data-state="uiState">
    <label v-if="label" :for="htmlFor" :class="styles.label">
      {{ label }}
      <template v-if="required">
        <span :class="styles.required" aria-hidden="true">*</span>
        <span :class="styles.srOnly">(required)</span>
      </template>
    </label>
    <slot />
    <span
      v-if="hint && !error"
      :id="htmlFor ? `${htmlFor}-hint` : undefined"
      :class="styles.hint"
    >
      {{ hint }}
    </span>
    <span
      v-if="error"
      :id="htmlFor ? `${htmlFor}-error` : undefined"
      :class="styles.error"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>
