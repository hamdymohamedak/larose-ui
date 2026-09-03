<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { getRetryDelay } from '@larose-ui/data-core';
import { useQuery } from './useQuery';

const props = withDefaults(
  defineProps<{
    url: string;
    enabled?: boolean;
    permissionAllowed?: boolean;
    baseUrl?: string;
  }>(),
  {
    enabled: true,
    permissionAllowed: true,
  },
);

const urlRef = computed(() => props.url);
const query = useQuery(urlRef, {
  enabled: props.enabled,
  permissionAllowed: computed(() => props.permissionAllowed),
  baseUrl: props.baseUrl,
});
const { status, data, error, isEmpty, retryCount, refetch, retry } = query;

const countdown = ref<number | null>(null);
let timer: ReturnType<typeof setInterval> | null = null;

function clearCountdown() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  countdown.value = null;
}

watch(
  () => [error.value, status.value, retryCount.value] as const,
  ([err, currentStatus]) => {
    clearCountdown();
    if (currentStatus !== 'error' || !err || err.code !== 429 || !err.retryable) return;
    const delay = Math.ceil(getRetryDelay(retryCount.value, 2000) / 1000);
    countdown.value = delay;
    timer = setInterval(() => {
      if (countdown.value === null || countdown.value <= 1) {
        clearCountdown();
        void retry();
        return;
      }
      countdown.value -= 1;
    }, 1000);
  },
);

onUnmounted(clearCountdown);

defineExpose({ refetch, retry });
</script>

<template>
  <div v-if="status === 'loading' || status === 'idle'">
    <slot name="loading">
      <div role="status" aria-busy="true" style="padding: var(--lr-space-4)">Loading...</div>
    </slot>
  </div>

  <div v-else-if="status === 'unauthorized'">
    <slot name="unauthorized">
      <div role="alert" style="padding: var(--lr-space-4); color: var(--lr-color-error)">
        You do not have permission to view this data.
      </div>
    </slot>
  </div>

  <div v-else-if="status === 'error' && error" role="alert" :data-lr-error="error.code">
    <p style="color: var(--lr-color-error); margin-bottom: var(--lr-space-2)">
      {{ error.message }}
    </p>
    <button v-if="error.retryable && error.code !== 429" type="button" @click="retry()">
      Retry
    </button>
    <p
      v-if="countdown !== null"
      style="font-size: var(--lr-font-size-sm); color: var(--lr-color-text-muted)"
    >
      Retrying in {{ countdown }}s...
    </p>
  </div>

  <div v-else-if="isEmpty">
    <slot name="empty">
      <div role="status" style="padding: var(--lr-space-4); color: var(--lr-color-text-muted)">
        No data found
      </div>
    </slot>
  </div>

  <slot v-else-if="data !== null" :data="data" :refetch="refetch" />
</template>
