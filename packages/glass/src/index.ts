// Types
export type {
  GlassLens,
  GlassPosition,
  DisplacementMapData,
  DisplacementMapOptions,
  GlassRendererKind,
  GlassSurface,
  GlassEngineOptions,
  GlassFilterRegion,
  GlassRendererContext,
  GlassRenderer,
  GlassEngineState,
} from './types';

// Lens
export {
  DEFAULT_LENS,
  resolveLens,
  lensGeometryKey,
  lensesGeometryEqual,
} from './lens/defaults';
export { lensFromTokens, LENS_PRESETS } from './lens/presets';
export {
  LIQUID_GLASS_DEFAULTS,
  isLiquidGlassEnabled,
  liquidGlassOverrides,
  liquidGlassOpticalKey,
  resolveLiquidGlassLens,
} from './lens/liquid-glass';
export type { LiquidGlassProps } from './lens/liquid-glass';
export {
  computeFilterRegion,
  computeMapDimensions,
  filterRegionMarkupAttrs,
  FILTER_PADDING,
} from './lens/filter-region';

// Displacement map — core portable primitive
export {
  generateDisplacementMap,
  generateDisplacementMapFull,
  displacementMapsEqual,
} from './displacement/displacement-map';
export {
  getCachedDisplacementMap,
  clearDisplacementMapCache,
  displacementMapCacheSize,
} from './displacement/map-cache';
export {
  roundedRectSdf,
  computeLensDisplacement,
  encodeDisplacementChannel,
} from './displacement/lens-profile';

// Engine
export { GlassEngine, createGlassEngine } from './engine/glass-engine';
export { selectRenderer } from './engine/renderer-selector';

// Renderers
export { SVGGlassRenderer, displacementScale, removeSharedDefsIfEmpty } from './renderers/svg-glass-renderer';
export { WebGLGlassRenderer } from './renderers/webgl-glass-renderer';
export { FallbackGlassRenderer } from './renderers/fallback-renderer';

// Capabilities
export {
  supportsSVGGlass,
  supportsBackdropGlassRefraction,
  supportsBackdropSvgDisplacement,
  supportsWebGLGlass,
  supportsCanvasGlass,
  supportsVideoGlass,
  resetCapabilityCache,
} from './capabilities/detect';

// Debug (development)
export {
  setGlassDebugEnabled,
  isGlassDebugEnabled,
  renderGlassDebugPanel,
  removeGlassDebugPanel,
} from './debug/glass-debug';

// Re-export canonical tokens from @larose-ui/tokens
export { getGlassTokens, glassTokensToCSSVariables } from '@larose-ui/tokens';
export type { GlassTokens } from '@larose-ui/tokens';
