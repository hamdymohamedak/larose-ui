<script setup lang="ts">
import { computed, provide } from 'vue';
import { Alert } from '@larose-ui/vue';
import {
  checkVersionCompatibility,
  type VersionCheckOptions,
} from '@larose-ui/enterprise-core';
import { VERSION_KEY } from './version';

const props = withDefaults(
  defineProps<
    VersionCheckOptions & {
      showBanner?: boolean;
    }
  >(),
  { showBanner: true },
);

const info = computed(() =>
  checkVersionCompatibility({
    frontend: props.frontend,
    backend: props.backend,
    minBackend: props.minBackend,
    maxBackend: props.maxBackend,
    deprecatedFeatures: props.deprecatedFeatures,
    requiredFeatures: props.requiredFeatures,
  }),
);

provide(VERSION_KEY, info);
</script>

<template>
  <Alert v-if="showBanner && !info.compatible" variant="warning" title="Version mismatch">
    {{ info.warnings[0] ?? 'This feature requires an application update.' }}
  </Alert>
  <slot />
</template>
