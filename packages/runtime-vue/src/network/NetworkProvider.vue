<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { NetworkMonitor } from '@larose-ui/network';
import { provideNetwork } from './context';

const props = defineProps<{ monitor?: NetworkMonitor }>();
const network = provideNetwork(props.monitor);

onMounted(() => network.mount());
onUnmounted(() => network.unmount());
</script>

<template>
  <slot />
</template>
