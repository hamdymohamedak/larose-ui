<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import type { Density, Environment, ThemeMode } from '@larose-ui/core';
import type { LaRoseLocale } from '../../types';

interface LaRosePublicConfig {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  appearance?: 'light' | 'dark' | 'system';
  enableToasts?: boolean;
  locale?: LaRoseLocale;
  environment?: Environment;
}

const config = useRuntimeConfig().public.laRose as LaRosePublicConfig;
</script>

<template>
  <LaRoseProvider
    :theme="config.theme"
    :density="config.density"
    :tenant-id="config.tenantId"
    :appearance="config.appearance"
    :enable-toasts="config.enableToasts !== false"
    :locale="config.locale"
    :environment="config.environment"
  >
    <slot />
  </LaRoseProvider>
</template>
