import type { GlassLens } from '../types';
import { getGlassTokens } from '@larose-ui/tokens';
import type { ThemeMode } from '@larose-ui/core';

/** Build a full lens from design tokens + geometry overrides. */
export function lensFromTokens(
  geometry: Pick<GlassLens, 'width' | 'height' | 'borderRadius'>,
  mode: ThemeMode = 'light',
  overrides?: Partial<GlassLens>,
): GlassLens {
  const tokens = getGlassTokens(mode);
  return {
    ...geometry,
    depth: tokens.depth,
    curvature: tokens.curvature,
    scale: tokens.refractionScale,
    chroma: tokens.chroma,
    blur: tokens.blur,
    glow: tokens.glow,
    edgeHighlight: tokens.edgeHighlight,
    specularAngle: tokens.specularAngle,
    splay: tokens.splay,
    ...overrides,
  };
}

/** Preset lenses for common component shapes. */
export const LENS_PRESETS = {
  toggleIndicator: (width: number, height: number): GlassLens =>
    lensFromTokens(
      { width, height, borderRadius: height / 2 },
      'light',
      { depth: 10, curvature: 42, scale: 0.9, chroma: 0.12, edgeHighlight: 0.28 },
    ),

  switchThumb: (size: number): GlassLens =>
    lensFromTokens(
      { width: size, height: size, borderRadius: size / 2 },
      'light',
      { depth: 9, curvature: 40, scale: 0.85, splay: 1, chroma: 0.1 },
    ),

  sliderThumb: (w: number, h: number): GlassLens =>
    lensFromTokens(
      { width: w, height: h, borderRadius: h / 2 },
      'light',
      { depth: 7, curvature: 35, scale: 0.7, splay: 0.9, chroma: 0.08 },
    ),

  card: (w: number, h: number, radius: number): GlassLens =>
    lensFromTokens(
      { width: w, height: h, borderRadius: radius },
      'light',
      { depth: 10, curvature: 38, scale: 1, glow: 0.1 },
    ),

  button: (w: number, h: number, radius: number): GlassLens =>
    lensFromTokens(
      { width: w, height: h, borderRadius: radius },
      'light',
      { depth: 10, curvature: 40, scale: 1, chroma: 0.1 },
    ),

  popover: (w: number, h: number): GlassLens =>
    lensFromTokens(
      { width: w, height: h, borderRadius: 16 },
      'light',
      { depth: 8, curvature: 32, scale: 0.8, glow: 0.12 },
    ),

  tooltip: (w: number, h: number): GlassLens =>
    lensFromTokens(
      { width: w, height: h, borderRadius: 8 },
      'light',
      { depth: 6, curvature: 28, scale: 0.65, chroma: 0.06 },
    ),

  tabBarIndicator: (width: number, height: number): GlassLens =>
    lensFromTokens(
      { width, height, borderRadius: height / 2 },
      'light',
      { depth: 10, curvature: 44, scale: 0.92, chroma: 0.14, edgeHighlight: 0.3, glow: 0.14 },
    ),
} as const;
