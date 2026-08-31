import type { Density } from '@larose-ui/core';
import {
  applyResolvedTheme,
  applyTokensToElement,
  createTenantTheme,
  getTokens,
} from '@larose-ui/tokens';
import { getThemePreset, type ThemePreset, type ThemePresetId } from './presets';
import { resolveTheme } from './resolveTheme';

export { createTheme } from './createTheme';
export { resolveTheme, mergeThemeInput } from './resolveTheme';
export { normalizeThemeInput, isLaRoseTheme, resolvePresetId } from './normalizeTheme';
export { getThemePreset, listThemePresets, type ThemePreset, type ThemePresetId } from './presets';
export type {
  LaRoseTheme,
  LaRoseThemeInput,
  LaRoseThemeMotionConfig,
  LaRoseThemeTypographyInput,
  ComponentConfiguration,
  ComponentDefaultPropsMap,
  ComponentMotionOverride,
  ResolvedLaRoseTheme,
  ResolveThemeInput,
} from './types';

export function applyThemePreset(
  element: HTMLElement,
  presetId: ThemePresetId,
  density: Density = 'comfortable',
): ThemePreset {
  const preset = getThemePreset(presetId);
  const resolved = resolveTheme({
    theme: { preset: presetId },
    density,
    mode: preset.mode,
  });

  applyResolvedTheme(element, {
    mode: resolved.mode,
    density: resolved.density,
    tokenOverrides: resolved.tokenOverrides,
    brandColors: resolved.brandColors,
    componentTokenOverrides: resolved.componentTokenOverrides,
    presetId,
  });

  return preset;
}

export { createTenantTheme, applyTokensToElement, applyResolvedTheme, getTokens };
export type { ColorTokens } from '@larose-ui/tokens';
export type { ThemeMode, Density } from '@larose-ui/core';
