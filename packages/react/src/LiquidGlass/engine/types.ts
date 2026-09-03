import type { CSSProperties, ReactNode } from 'react';

/** Shared optical + surface props for all LiquidGlass components. */
export interface LiquidGlassOptics {
  /** Backdrop blur radius in px (non-Chromium fallback). @default 18 */
  blur?: number;
  /** Backdrop saturation multiplier. @default 1.5 */
  saturation?: number;
  /** Glass fill on Chromium (SVG refraction path). @default rgba(255,255,255,0.10) */
  tint?: string;
  /** Glass fill on non-Chromium fallback. @default rgba(255,255,255,0.14) */
  tintFallback?: string;
  /** feDisplacementMap scale — higher = stronger refraction. @default 34 */
  displacementScale?: number;
  /** Refracting bezel band width in px. @default 20 */
  bezelWidth?: number;
  /** Raw displacement magnitude multiplier (0–2). @default 1 */
  refractionStrength?: number;
  /** Show conic-gradient specular rim. @default true */
  showSpecular?: boolean;
  /** Specular conic-gradient start angle (deg). @default 200 */
  specularAngle?: number;
  /** Brightest specular peak opacity. @default 0.85 */
  specularTopOpacity?: number;
  /** Specular edge/wing opacity. @default 0.55 */
  specularEdgeOpacity?: number;
  /** 1px inner top highlight opacity. @default 0.35 */
  innerTopHighlight?: number;
  /** Inner bottom shadow fog opacity. @default 0.20 */
  innerBottomShadow?: number;
  /** Drop shadow intensity (0 = off). @default 1 */
  shadowIntensity?: number;
  /** Inset border colour. @default rgba(255,255,255,0.35) */
  borderColor?: string;
}

/** Geometry props for a liquid glass surface. */
export interface LiquidGlassGeometry {
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  /** Corner radius in px. @default 30 */
  borderRadius?: number;
}

export interface LiquidGlassSurfaceProps extends LiquidGlassOptics, LiquidGlassGeometry {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** HTML element or component for the glass shell. @default 'div' */
  as?: 'div' | 'nav' | 'header' | 'section' | 'button' | 'span';
  /** Accessible label (recommended for nav/header). */
  'aria-label'?: string;
  /** Expose the displacement map data URL (for debug / lens lab). */
  onDisplacementMapChange?: (dataUrl: string) => void;
}

export type ResolvedLiquidGlassOptics = Required<LiquidGlassOptics>;
