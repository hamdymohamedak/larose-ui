import type { LiquidGlassOptics, ResolvedLiquidGlassOptics } from './types';

export const LIQUID_GLASS_OPTICS_DEFAULTS: ResolvedLiquidGlassOptics = {
  blur: 18,
  saturation: 1.5,
  tint: 'rgba(255, 255, 255, 0.10)',
  tintFallback: 'rgba(255, 255, 255, 0.14)',
  displacementScale: 34,
  bezelWidth: 20,
  refractionStrength: 1,
  showSpecular: true,
  specularAngle: 200,
  specularTopOpacity: 0.85,
  specularEdgeOpacity: 0.55,
  innerTopHighlight: 0.35,
  innerBottomShadow: 0.2,
  shadowIntensity: 1,
  borderColor: 'rgba(255, 255, 255, 0.35)',
};

export function resolveLiquidGlassOptics(
  overrides?: LiquidGlassOptics,
): ResolvedLiquidGlassOptics {
  return { ...LIQUID_GLASS_OPTICS_DEFAULTS, ...overrides };
}

/** Preset optics tuned for common component shapes. */
export const LIQUID_GLASS_PRESETS = {
  tabBar: {
    displacementScale: 34,
    bezelWidth: 20,
    borderRadius: 30,
  },
  button: {
    displacementScale: 28,
    bezelWidth: 16,
    borderRadius: 24,
    shadowIntensity: 0.85,
  },
  topBar: {
    displacementScale: 32,
    bezelWidth: 18,
    borderRadius: 20,
    specularAngle: 180,
    shadowIntensity: 0.9,
  },
  card: {
    displacementScale: 30,
    bezelWidth: 18,
    borderRadius: 22,
  },
  pill: {
    displacementScale: 26,
    bezelWidth: 14,
    borderRadius: 999,
  },
  switch: {
    displacementScale: 24,
    bezelWidth: 12,
    borderRadius: 999,
    shadowIntensity: 0.7,
  },
  slider: {
    displacementScale: 22,
    bezelWidth: 12,
    borderRadius: 999,
    shadowIntensity: 0.75,
  },
  checkbox: {
    displacementScale: 20,
    bezelWidth: 10,
    borderRadius: 8,
    shadowIntensity: 0.65,
  },
  progress: {
    displacementScale: 18,
    bezelWidth: 10,
    borderRadius: 999,
    shadowIntensity: 0.6,
  },
} as const;
