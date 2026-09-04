<script setup lang="ts">
/**
 * Optional toast wrapper — keeps toast host behind enableToasts without duplicating the platform tree.
 */
import { ToastProvider } from '@larose-ui/vue';

withDefaults(
  defineProps<{
    enabled?: boolean;
    placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  }>(),
  {
    enabled: true,
    placement: 'bottom-right',
  },
);
</script>

<template>
  <ToastProvider v-if="enabled" :placement="placement">
    <slot />
  </ToastProvider>
  <slot v-else />
</template>
