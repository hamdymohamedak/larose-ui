import type { ThemeMode } from '@larose-ui/core';

export interface GlassTokens {
  refractionScale: number;
  depth: number;
  curvature: number;
  chroma: number;
  blur: number;
  glow: number;
  edgeHighlight: number;
  specularAngle: number;
  splay: number;
}

export function getGlassTokens(_mode: ThemeMode): GlassTokens {
  return {
    refractionScale: 1,
    depth: 10,
    curvature: 40,
    chroma: 0.08,
    blur: 0,
    glow: 0.1,
    edgeHighlight: 0.55,
    specularAngle: 45,
    splay: 1,
  };
}

export function glassTokensToCSSVariables(tokens: GlassTokens): Record<string, string> {
  return {
    '--lr-glass-refraction-scale': String(tokens.refractionScale),
    '--lr-glass-depth': String(tokens.depth),
    '--lr-glass-curvature': String(tokens.curvature),
    '--lr-glass-chroma': String(tokens.chroma),
    '--lr-glass-blur': `${tokens.blur}px`,
    '--lr-glass-glow': String(tokens.glow),
    '--lr-glass-edge-highlight': String(tokens.edgeHighlight),
    '--lr-glass-specular-angle': `${tokens.specularAngle}deg`,
    '--lr-glass-splay': String(tokens.splay),
  };
}
