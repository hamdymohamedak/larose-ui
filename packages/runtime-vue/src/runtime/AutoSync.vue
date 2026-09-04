<script setup lang="ts">
import { onUnmounted, watch } from 'vue';
import type { SessionState } from '@larose-ui/core';
import { shouldSyncOfflineQueue } from '@larose-ui/runtime-core';
import { useNetwork } from '../network/context';
import { useOffline } from '../offline/context';

const props = defineProps<{
  session?: SessionState;
}>();

const network = useNetwork();
const offline = useOffline();

const stop = watch(
  () => [network.online, offline.queue.length, props.session] as const,
  () => {
    if (!shouldSyncOfflineQueue(props.session)) return;
    if (!network.online || offline.queue.length === 0) return;
    void offline.sync(async (request) => {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    });
  },
  { immediate: true },
);

onUnmounted(stop);
</script>

<template>
  <slot />
</template>
