<script setup lang="ts">
import type { Size } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Spinner/Spinner.module.css';

withDefaults(
  defineProps<{
    size?: Size;
    label?: string;
  }>(),
  {
    size: 'md',
    label: 'Loading',
  },
);
</script>

<template>
  <span :class="styles.spinner" :data-size="size" role="status" :aria-label="label">
    <span :class="styles.circle" aria-hidden="true" />
  </span>
</template>
