<script setup lang="ts">
import type { FeatureState } from '@larose-ui/runtime-core';
import { provideFeatures } from './context';

const props = withDefaults(
  defineProps<{
    features?: Record<string, FeatureState>;
    loading?: boolean;
  }>(),
  {
    features: () => ({}),
    loading: false,
  },
);

provideFeatures(props.features, props.loading);
</script>

<template>
  <slot />
</template>
