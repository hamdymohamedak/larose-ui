import type { GlassLens } from '../types';
import { lensFromTokens } from './presets';
import type { ThemeMode } from '@larose-ui/core';

/**
 * Optical + geometry parameters for liquid glass surfaces.
 * Width/height/borderRadius are optional when geometry is measured at runtime (e.g. TabBar indicator).
 */
export interface LiquidGlassProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  /** Displacement scale multiplier (0.05–2). */
  scale?: number;
  depth?: number;
  curvature?: number;
  splay?: number;
  chroma?: number;
  blur?: number;
  glow?: number;
  edgeHighlight?: number;
  specularAngle?: number;
}

export const LIQUID_GLASS_DEFAULTS: Required<
  Pick<
    LiquidGlassProps,
    | 'scale'
    | 'depth'
    | 'curvature'
    | 'splay'
    | 'chroma'
    | 'blur'
    | 'glow'
    | 'edgeHighlight'
    | 'specularAngle'
  >
> = {
  scale: 1,
  depth: 10,
  curvature: 40,
  splay: 1,
  chroma: 0.08,
  blur: 0,
  glow: 0.1,
  edgeHighlight: 0.55,
  specularAngle: 45,
};

export function isLiquidGlassEnabled(
  liquidGlass?: boolean | LiquidGlassProps,
): liquidGlass is true | LiquidGlassProps {
  return liquidGlass === true || (typeof liquidGlass === 'object' && liquidGlass !== null);
}

export function liquidGlassOverrides(
  liquidGlass?: boolean | LiquidGlassProps,
): LiquidGlassProps | undefined {
  if (!isLiquidGlassEnabled(liquidGlass)) return undefined;
  if (liquidGlass === true) return {};
  return liquidGlass;
}

/** Merge token defaults, liquid-glass defaults, runtime geometry, and user overrides. */
export function resolveLiquidGlassLens(
  geometry: Pick<GlassLens, 'width' | 'height' | 'borderRadius'>,
  liquidGlass?: boolean | LiquidGlassProps,
  mode: ThemeMode = 'light',
): GlassLens {
  const overrides = liquidGlassOverrides(liquidGlass) ?? {};
  return lensFromTokens(
    {
      width: overrides.width ?? geometry.width,
      height: overrides.height ?? geometry.height,
      borderRadius: overrides.borderRadius ?? geometry.borderRadius,
    },
    mode,
    {
      ...LIQUID_GLASS_DEFAULTS,
      ...overrides,
    },
  );
}

export function liquidGlassOpticalKey(props: LiquidGlassProps | undefined): string {
  if (!props) return 'default';
  const d = LIQUID_GLASS_DEFAULTS;
  return [
    props.width ?? '',
    props.height ?? '',
    props.borderRadius ?? '',
    props.scale ?? d.scale,
    props.depth ?? d.depth,
    props.curvature ?? d.curvature,
    props.splay ?? d.splay,
    props.chroma ?? d.chroma,
    props.blur ?? d.blur,
    props.glow ?? d.glow,
    props.edgeHighlight ?? d.edgeHighlight,
    props.specularAngle ?? d.specularAngle,
  ].join(':');
}
