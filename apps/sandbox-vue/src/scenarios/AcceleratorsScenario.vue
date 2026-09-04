<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import AcceleratorsInner from './AcceleratorsInner.vue';
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox">
    <AcceleratorsInner />
  </LaRoseProvider>
</template>
