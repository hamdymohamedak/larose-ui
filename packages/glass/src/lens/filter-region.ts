import type { GlassFilterRegion, GlassLens, GlassPosition } from '../types';
import { resolveLens } from './defaults';

export const FILTER_PADDING = 4;

/**
 * SVG filter attributes in element-local coordinates (userSpaceOnUse).
 * Tighter regions improve Safari backdrop-filter performance and clipping.
 */
export function filterRegionMarkupAttrs(
  lens: GlassLens,
  padding = FILTER_PADDING,
): {
  filterUnits: 'userSpaceOnUse';
  primitiveUnits: 'userSpaceOnUse';
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const resolved = resolveLens(lens);
  return {
    filterUnits: 'userSpaceOnUse',
    primitiveUnits: 'userSpaceOnUse',
    x: -padding,
    y: -padding,
    width: resolved.width + padding * 2,
    height: resolved.height + padding * 2,
  };
}

/** Tightly bounded SVG filter region for Safari compatibility. */
export function computeFilterRegion(
  lens: GlassLens,
  position: GlassPosition,
  padding = FILTER_PADDING,
): GlassFilterRegion {
  const resolved = resolveLens(lens);
  return {
    x: position.x - padding,
    y: position.y - padding,
    width: resolved.width + padding * 2,
    height: resolved.height + padding * 2,
  };
}

/** Map logical lens size to displacement map pixel dimensions. */
export function computeMapDimensions(
  lens: GlassLens,
  pixelRatio = 1,
): { width: number; height: number } {
  const resolved = resolveLens(lens);
  const width = Math.max(2, Math.round(resolved.width * pixelRatio));
  const height = Math.max(2, Math.round(resolved.height * pixelRatio));
  return { width, height };
}
