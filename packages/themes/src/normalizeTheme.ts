import type { TokenOverrides } from '@larose-ui/tokens';
import type { LaRoseTheme, LaRoseThemeInput } from './types';
import { getThemePreset, type ThemePresetId } from './presets';

function mergeTokenLayers(...layers: Array<TokenOverrides | undefined>): TokenOverrides {
  const result: TokenOverrides = {};

  for (const layer of layers) {
    if (!layer) continue;

    result.colors = { ...result.colors, ...layer.colors };
    result.surfaces = { ...result.surfaces, ...layer.surfaces };
    result.fontFamily = { ...result.fontFamily, ...layer.fontFamily };
    result.fontSize = { ...result.fontSize, ...layer.fontSize };
    result.fontWeight = { ...result.fontWeight, ...layer.fontWeight };
    result.lineHeight = { ...result.lineHeight, ...layer.lineHeight };
    result.space = { ...result.space, ...layer.space };
    result.radius = { ...result.radius, ...layer.radius };
    result.shadow = { ...result.shadow, ...layer.shadow };
    result.duration = { ...result.duration, ...layer.duration };
    result.easing = { ...result.easing, ...layer.easing };

    if (layer.typography) {
      result.typography = { ...(result.typography ?? {}), ...layer.typography };
    }
  }

  return result;
}

export function normalizeThemeInput(input: LaRoseThemeInput = {}): LaRoseTheme {
  const preset = input.preset ?? input.base ?? 'refined';
  const presetColors = getThemePreset(preset).colors;

  const shorthandTokens: TokenOverrides = mergeTokenLayers({
    colors: input.colors,
    radius: input.radius,
    space: input.spacing,
    shadow: input.shadows,
    duration: input.motion?.duration,
    easing: input.motion?.easing,
    fontFamily: input.typography?.fontFamily
      ? { sans: input.typography.fontFamily }
      : undefined,
    typography: input.typography?.roles,
  });

  const tokens = mergeTokenLayers(
    { colors: presetColors },
    input.tokens,
    shorthandTokens,
  );

  return {
    ...input,
    preset,
    tokens,
    motion: {
      preset: input.motion?.preset,
      reducedMotion: input.motion?.reducedMotion,
      duration: input.motion?.duration,
      easing: input.motion?.easing,
    },
  };
}

export function isLaRoseTheme(value: LaRoseThemeInput | LaRoseTheme): value is LaRoseTheme {
  return Boolean(value.preset && value.tokens);
}

export function resolvePresetId(
  theme?: LaRoseThemeInput | LaRoseTheme,
  legacyPreset?: ThemePresetId,
): ThemePresetId {
  return theme?.preset ?? theme?.base ?? legacyPreset ?? 'refined';
}
