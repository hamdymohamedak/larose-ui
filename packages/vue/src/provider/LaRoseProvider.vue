<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import type { Density, ThemeMode } from '@larose-ui/core';
import { applyResolvedTheme, type ColorTokens } from '@larose-ui/tokens';
import {
  createTheme,
  resolveTheme,
  type ComponentConfiguration,
  type LaRoseTheme,
  type LaRoseThemeInput,
} from '@larose-ui/themes';
import { themeCustomizationKey } from '../theme/types';
import type { ThemeCustomizationContextValue } from '../theme/types';

export interface LaRoseProviderProps {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  themeConfig?: LaRoseThemeInput | LaRoseTheme;
  components?: ComponentConfiguration;
}

const props = withDefaults(defineProps<LaRoseProviderProps>(), {
  theme: 'light',
  density: 'comfortable',
  components: () => ({}),
});

const rootRef = ref<HTMLDivElement | null>(null);

const normalizedTheme = computed(() =>
  props.themeConfig
    ? 'tokens' in props.themeConfig && props.themeConfig.tokens
      ? (props.themeConfig as LaRoseTheme)
      : createTheme(props.themeConfig)
    : createTheme({ preset: 'refined' }),
);

const resolved = computed(() =>
  resolveTheme({
    theme: normalizedTheme.value,
    density: props.density,
    mode: props.theme,
    brandColors: props.brandColors,
    components: props.components,
  }),
);

const customizationValue = computed<ThemeCustomizationContextValue>(() => ({
  theme: normalizedTheme.value,
  resolved: resolved.value,
  components: props.components,
}));

provide(themeCustomizationKey, customizationValue);

function applyTheme() {
  if (!rootRef.value) return;
  applyResolvedTheme(rootRef.value, {
    mode: resolved.value.mode,
    density: resolved.value.density,
    tokenOverrides: resolved.value.tokenOverrides,
    brandColors: resolved.value.brandColors,
    componentTokenOverrides: resolved.value.componentTokenOverrides,
    presetId: resolved.value.preset,
  });
  if (props.tenantId) {
    rootRef.value.dataset.lrTenant = props.tenantId;
  }
}

onMounted(applyTheme);
watch(resolved, applyTheme);
watch(() => props.tenantId, applyTheme);
</script>

<template>
  <div ref="rootRef" data-lr-provider style="min-height: inherit">
    <slot />
  </div>
</template>
