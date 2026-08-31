<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Density, ThemeMode } from '@larose-ui/core';
  import { applyResolvedTheme, type ColorTokens } from '@larose-ui/tokens';
  import {
    createTheme,
    resolveTheme,
    type ComponentConfiguration,
    type LaRoseTheme,
    type LaRoseThemeInput,
  } from '@larose-ui/themes';
  import { themeCustomizationKey, type ThemeCustomizationContextValue } from '../theme/context';
  import { setContext } from 'svelte';
  import type { LaRoseProviderProps } from '../types';

  let {
    theme = 'light',
    density = 'comfortable',
    tenantId,
    brandColors,
    themeConfig,
    components = {},
    children,
  }: LaRoseProviderProps = $props();

  let rootEl = $state<HTMLDivElement | null>(null);

  const normalizedTheme = $derived(
    themeConfig
      ? 'tokens' in themeConfig && themeConfig.tokens
        ? (themeConfig as LaRoseTheme)
        : createTheme(themeConfig)
      : createTheme({ preset: 'refined' }),
  );

  const resolved = $derived(
    resolveTheme({
      theme: normalizedTheme,
      density,
      mode: theme,
      brandColors,
      components,
    }),
  );

  const customizationValue = $derived<ThemeCustomizationContextValue>({
    theme: normalizedTheme,
    resolved,
    components,
  });

  setContext(themeCustomizationKey, () => customizationValue);

  $effect(() => {
    if (!rootEl) return;
    applyResolvedTheme(rootEl, {
      mode: resolved.mode,
      density: resolved.density,
      tokenOverrides: resolved.tokenOverrides,
      brandColors: resolved.brandColors,
      componentTokenOverrides: resolved.componentTokenOverrides,
      presetId: resolved.preset,
    });
    if (tenantId) rootEl.dataset.lrTenant = tenantId;
  });
</script>

<div bind:this={rootEl} data-lr-provider style="min-height: inherit">
  {@render children()}
</div>
