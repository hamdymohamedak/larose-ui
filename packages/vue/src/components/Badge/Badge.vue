<script setup lang="ts">
import styles from '@larose-ui/styles/components/Badge/Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

withDefaults(
  defineProps<{
    variant?: BadgeVariant;
  }>(),
  {
    variant: 'default',
  },
);
</script>

<template>
  <span :class="styles.badge" :data-variant="variant">
    <slot />
  </span>
</template>
