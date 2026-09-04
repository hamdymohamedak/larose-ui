<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import ToastInner from './ToastInner.vue';
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox" :enable-toasts="true">
    <ToastInner />
  </LaRoseProvider>
</template>
