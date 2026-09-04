/**
 * Showcase optics for sandbox liquid-glass scenarios.
 * Explicit values keep specular rims / highlights visible on the aurora backdrop.
 */
export const SANDBOX_GLASS_OPTICS = {
  showSpecular: true,
  specularAngle: 200,
  specularTopOpacity: 0.92,
  specularEdgeOpacity: 0.7,
  innerTopHighlight: 0.5,
  innerBottomShadow: 0.28,
  shadowIntensity: 1.1,
  refractionStrength: 1.15,
  displacementScale: 36,
  bezelWidth: 22,
  saturation: 1.65,
  blur: 18,
  tint: 'rgba(255, 255, 255, 0.12)',
  tintFallback: 'rgba(255, 255, 255, 0.16)',
  borderColor: 'rgba(255, 255, 255, 0.45)',
};

/** Compact controls — keep bezels proportional to switch/slider/progress size. */
export const SANDBOX_GLASS_CONTROLS = {
  showSpecular: true,
  specularAngle: 200,
  specularTopOpacity: 0.75,
  specularEdgeOpacity: 0.45,
  innerTopHighlight: 0.4,
  innerBottomShadow: 0.2,
  shadowIntensity: 0.85,
  refractionStrength: 1,
  displacementScale: 24,
  bezelWidth: 12,
  saturation: 1.5,
  blur: 14,
  tint: 'rgba(255, 255, 255, 0.10)',
  tintFallback: 'rgba(255, 255, 255, 0.14)',
  borderColor: 'rgba(255, 255, 255, 0.35)',
};

export const SANDBOX_GLASS_CARD = {
  ...SANDBOX_GLASS_OPTICS,
  displacementScale: 32,
  bezelWidth: 20,
  borderRadius: 22,
};

export const SANDBOX_GLASS_CHROME = {
  ...SANDBOX_GLASS_OPTICS,
  displacementScale: 34,
  bezelWidth: 18,
  specularAngle: 180,
};
