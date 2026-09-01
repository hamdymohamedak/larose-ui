import type { GlassLens } from '../types';

/** Neutral displacement channel value (no shift). */
export const DISPLACEMENT_NEUTRAL = 128;

/** Default lens values aligned with laRose glass tokens. */
export const DEFAULT_LENS: Required<GlassLens> = {
  width: 120,
  height: 48,
  borderRadius: 24,
  depth: 10,
  curvature: 40,
  splay: 1,
  scale: 1,
  chroma: 0.08,
  blur: 0,
  glow: 0.1,
  edgeHighlight: 0.55,
  specularAngle: 45,
};

export function resolveLens(lens: GlassLens): Required<GlassLens> {
  return { ...DEFAULT_LENS, ...lens };
}

export function lensGeometryKey(lens: Required<GlassLens>): string {
  return [
    lens.width,
    lens.height,
    lens.borderRadius,
    lens.depth,
    lens.curvature,
    lens.splay,
    lens.scale,
    lens.chroma,
    lens.blur,
    lens.glow,
    lens.edgeHighlight,
    lens.specularAngle,
  ].join(':');
}

export function lensesGeometryEqual(a: GlassLens, b: GlassLens): boolean {
  return lensGeometryKey(resolveLens(a)) === lensGeometryKey(resolveLens(b));
}
