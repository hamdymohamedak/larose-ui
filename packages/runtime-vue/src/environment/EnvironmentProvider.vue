<script setup lang="ts">
import type { Environment } from '@larose-ui/core';
import { computed } from 'vue';
import { provideEnvironment } from './context';

const props = withDefaults(
  defineProps<{ environment?: Environment }>(),
  { environment: 'development' },
);

provideEnvironment(props.environment);

const envLabels: Partial<Record<Environment, string>> = {
  staging: 'STAGING',
  demo: 'DEMO MODE',
  readonly: 'READ ONLY',
  maintenance: 'MAINTENANCE',
};

const showBanner = computed(
  () => props.environment !== 'development' && props.environment !== 'production',
);
const label = computed(() => envLabels[props.environment]);
</script>

<template>
  <div
    v-if="showBanner && label"
    data-lr-env-banner
    style="background: var(--lr-color-warning, #ca8a04); color: var(--lr-color-text-inverse, #fff); text-align: center; padding: var(--lr-space-1, 0.25rem); font-size: var(--lr-font-size-xs, 0.75rem); font-weight: 600; letter-spacing: 0.05em"
  >
    {{ label }}
  </div>
  <slot />
</template>
