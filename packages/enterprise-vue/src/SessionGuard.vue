<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { isSafeRedirectPath } from '@larose-ui/core';
import { Dialog } from '@larose-ui/vue';

const props = withDefaults(
  defineProps<{
    loginUrl?: string;
  }>(),
  { loginUrl: '/login' },
);

const emit = defineEmits<{ sessionExpired: [returnUrl: string] }>();

const expired = ref(false);

function handler(event: Event) {
  const detail = (event as CustomEvent<{ code?: number }>).detail;
  if (detail?.code === 401) expired.value = true;
}

onMounted(() => {
  window.addEventListener('larose:session-expired', handler);
});
onUnmounted(() => {
  window.removeEventListener('larose:session-expired', handler);
});

const safeLoginUrl = isSafeRedirectPath(props.loginUrl) ? props.loginUrl : '/login';

function handleRedirect() {
  const returnUrl = window.location.pathname + window.location.search;
  emit('sessionExpired', returnUrl);
  window.location.href = `${safeLoginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
}
</script>

<template>
  <slot />
  <Dialog
    :open="expired"
    title="Session expired"
    description="Your session has expired. Sign in again to continue."
    confirm-label="Sign in"
    cancel-label="Dismiss"
    @close="expired = false"
    @confirm="handleRedirect"
  />
</template>
