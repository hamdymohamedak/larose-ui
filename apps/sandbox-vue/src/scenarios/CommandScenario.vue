<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import CommandInner from './CommandInner.vue';
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox" :enable-toasts="true">
    <CommandInner />
  </LaRoseProvider>
</template>
