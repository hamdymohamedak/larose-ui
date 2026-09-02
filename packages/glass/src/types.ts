/** Glass lens geometry and optical parameters. */
export interface GlassLens {
  width: number;
  height: number;
  borderRadius: number;
  /** Lens thickness — controls refraction strength. */
  depth?: number;
  /** Surface curvature profile (0–100). */
  curvature?: number;
  /** Edge falloff exponent — higher pushes refraction toward edges. */
  splay?: number;
  /** Displacement scale multiplier. */
  scale?: number;
  /** Chromatic aberration intensity (0–1). */
  chroma?: number;
  /** Optional backdrop blur radius in px. */
  blur?: number;
  /** Subtle outer glow intensity (0–1). */
  glow?: number;
  /** Edge highlight intensity (0–1). */
  edgeHighlight?: number;
  /** Specular highlight angle in degrees. */
  specularAngle?: number;
}

export interface GlassPosition {
  x: number;
  y: number;
}

export interface DisplacementMapData {
  width: number;
  height: number;
  /** RGBA pixel data — R/G encode displacement, neutral = 128. */
  data: Uint8ClampedArray;
  /** Data URL for SVG feImage / WebGL texture upload. */
  dataUrl: string;
}

export interface DisplacementMapOptions {
  /** Use quadrant symmetry optimization (default true). */
  optimize?: boolean;
  /** Device pixel ratio for map resolution. */
  pixelRatio?: number;
}

export type GlassRendererKind = 'svg' | 'webgl' | 'fallback';

export type GlassSurface = 'dom' | 'canvas' | 'video';

export interface GlassEngineOptions {
  lens: GlassLens;
  position?: GlassPosition;
  surface?: GlassSurface;
  /** How refraction is applied — content warps SourceGraphic, backdrop warps what's behind the lens. */
  refractionMode?: 'content' | 'backdrop';
  /** Force a specific renderer (auto-detected when omitted). */
  renderer?: GlassRendererKind;
  /** Disable glass effect (fallback only). */
  disabled?: boolean;
  /** Development debugging overlays. */
  debug?: boolean;
}

export interface GlassFilterRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GlassRendererContext {
  root: HTMLElement | HTMLCanvasElement | HTMLVideoElement;
  lens: GlassLens;
  position: GlassPosition;
  displacementMap: DisplacementMapData;
  filterRegion: GlassFilterRegion;
  version: number;
  reducedMotion: boolean;
  instanceId?: string;
  debug?: boolean;
}

export interface GlassRenderer {
  readonly kind: GlassRendererKind;
  mount(): void;
  update(context: GlassRendererContext): void;
  setPosition(position: GlassPosition): void;
  /** Optional — resize overlay lens without regenerating displacement map. */
  setBounds?(bounds: { x: number; y: number; width: number; height: number }): void;
  resize(): void;
  destroy(): void;
}

export interface GlassEngineState {
  lens: GlassLens;
  position: GlassPosition;
  mapVersion: number;
  rendererKind: GlassRendererKind;
  enabled: boolean;
}
