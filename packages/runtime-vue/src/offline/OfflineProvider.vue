<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { OfflineQueue } from '@larose-ui/offline';
import { provideOffline } from './context';

const props = defineProps<{
  queue?: OfflineQueue;
  scopeId?: string;
}>();

const offline = provideOffline({ queue: props.queue, scopeId: props.scopeId });

onMounted(() => offline.mount());
onUnmounted(() => offline.unmount());
</script>

<template>
  <slot />
</template>
