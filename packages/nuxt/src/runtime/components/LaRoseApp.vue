<script setup lang="ts">
import { LaRoseProvider, RuntimeProvider } from '@larose-ui/vue';
import type { Density, ThemeMode } from '@larose-ui/core';

interface LaRosePublicConfig {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  runtime?: boolean | Record<string, unknown>;
}

const config = useRuntimeConfig().public.laRose as LaRosePublicConfig;

const runtimeEnabled = Boolean(config.runtime);
const runtimeContext =
  typeof config.runtime === 'object' && config.runtime !== null ? config.runtime : {};
</script>

<template>
  <LaRoseProvider
    :theme="config.theme"
    :density="config.density"
    :tenant-id="config.tenantId"
  >
    <RuntimeProvider v-if="runtimeEnabled" :initial-context="runtimeContext">
      <slot />
    </RuntimeProvider>
    <slot v-else />
  </LaRoseProvider>
</template>
