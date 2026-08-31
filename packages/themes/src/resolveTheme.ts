import type { Density, ThemeMode } from '@larose-ui/core';
import type { ColorTokens, ComponentTokenOverrides } from '@larose-ui/tokens';
import { getThemePreset } from './presets';
import { isLaRoseTheme, normalizeThemeInput, resolvePresetId } from './normalizeTheme';
import type {
  ComponentConfiguration,
  LaRoseTheme,
  LaRoseThemeInput,
  ResolveThemeInput,
  ResolvedLaRoseTheme,
} from './types';

function collectComponentTokenOverrides(
  components?: ComponentConfiguration,
): ComponentTokenOverrides {
  if (!components) return {};

  const result: ComponentTokenOverrides = {};

  for (const [name, config] of Object.entries(components)) {
    if (config && 'tokens' in config && config.tokens) {
      result[name as keyof ComponentTokenOverrides] = config.tokens as never;
    }
  }

  return result;
}

function resolveBrandColors(
  theme: LaRoseTheme,
  legacyBrandColors?: Partial<ColorTokens>,
): Partial<ColorTokens> {
  return {
    ...theme.tokens.colors,
    ...legacyBrandColors,
  };
}

/**
 * Resolve the final theme configuration from user input, presets, and legacy props.
 *
 * Precedence (lowest → highest):
 * Library defaults → Preset → Theme tokens → brandColors (legacy) → Component tokens
 */
export function resolveTheme(input: ResolveThemeInput = {}): ResolvedLaRoseTheme {
  const presetId = resolvePresetId(input.theme, input.themePreset);
  const theme: LaRoseTheme = input.theme
    ? isLaRoseTheme(input.theme)
      ? input.theme
      : normalizeThemeInput(input.theme)
    : normalizeThemeInput({ preset: presetId });

  const preset = getThemePreset(presetId);
  const mode: ThemeMode = input.mode ?? preset.mode;
  const density: Density = input.density ?? 'comfortable';
  const brandColors = resolveBrandColors(theme, input.brandColors);
  const componentTokenOverrides = collectComponentTokenOverrides(input.components);

  return {
    preset: presetId,
    mode,
    density,
    tokenOverrides: theme.tokens,
    brandColors,
    componentTokenOverrides,
    motion: theme.motion ?? {},
  };
}

export function mergeThemeInput(
  base: LaRoseThemeInput | LaRoseTheme,
  overrides?: LaRoseThemeInput,
): LaRoseTheme {
  const normalizedBase = isLaRoseTheme(base) ? base : normalizeThemeInput(base);
  if (!overrides) return normalizedBase;

  return normalizeThemeInput({
    preset: overrides.preset ?? overrides.base ?? normalizedBase.preset,
    tokens: {
      ...normalizedBase.tokens,
      ...overrides.tokens,
      colors: { ...normalizedBase.tokens.colors, ...overrides.tokens?.colors, ...overrides.colors },
      radius: { ...normalizedBase.tokens.radius, ...overrides.tokens?.radius, ...overrides.radius },
      space: { ...normalizedBase.tokens.space, ...overrides.tokens?.space, ...overrides.spacing },
      shadow: { ...normalizedBase.tokens.shadow, ...overrides.tokens?.shadow, ...overrides.shadows },
      duration: {
        ...normalizedBase.tokens.duration,
        ...overrides.tokens?.duration,
        ...overrides.motion?.duration,
      },
      easing: {
        ...normalizedBase.tokens.easing,
        ...overrides.tokens?.easing,
        ...overrides.motion?.easing,
      },
      typography: {
        ...normalizedBase.tokens.typography,
        ...overrides.tokens?.typography,
        ...overrides.typography?.roles,
      },
      fontFamily: overrides.typography?.fontFamily
        ? { sans: overrides.typography.fontFamily, ...normalizedBase.tokens.fontFamily }
        : normalizedBase.tokens.fontFamily,
    },
    motion: {
      ...normalizedBase.motion,
      ...overrides.motion,
    },
  });
}
