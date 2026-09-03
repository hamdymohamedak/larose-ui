<script setup lang="ts">
import ToastProvider from '../../../packages/vue/src/components/Toast/ToastProvider.vue';
import ToastDemoBody from './ToastDemoBody.vue';

withDefaults(
  defineProps<{
    autoTitle?: string;
    autoMessage?: string;
    buttonLabel?: string;
  }>(),
  {
    autoTitle: 'Welcome',
    autoMessage: 'laRose toast notifications are ready.',
    buttonLabel: 'Show toast',
  },
);
</script>

<template>
  <ToastProvider>
    <ToastDemoBody
      :auto-title="autoTitle"
      :auto-message="autoMessage"
      :button-label="buttonLabel"
    />
  </ToastProvider>
</template>
