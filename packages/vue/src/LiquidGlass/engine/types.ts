/** Shared chrome — every LiquidGlass component accepts direct CSS. */
export interface LiquidGlassChromeProps {
  className?: string;
  style?: LiquidGlassStyle;
}

export type LiquidGlassStyle = Record<string, string | number | undefined>;

export interface LiquidGlassOptics {
  blur?: number;
  saturation?: number;
  tint?: string;
  tintFallback?: string;
  displacementScale?: number;
  bezelWidth?: number;
  refractionStrength?: number;
  showSpecular?: boolean;
  specularAngle?: number;
  specularTopOpacity?: number;
  specularEdgeOpacity?: number;
  innerTopHighlight?: number;
  innerBottomShadow?: number;
  shadowIntensity?: number;
  borderColor?: string;
}

export interface LiquidGlassGeometry {
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  borderRadius?: number;
}

export interface LiquidGlassSurfaceProps
  extends LiquidGlassOptics, LiquidGlassGeometry, LiquidGlassChromeProps {
  as?: string;
  type?: string;
  disabled?: boolean;
  'aria-label'?: string;
  onDisplacementMapChange?: (dataUrl: string) => void;
}

export type ResolvedLiquidGlassOptics = Required<LiquidGlassOptics>;

export interface LiquidGlassTabItem {
  key: string;
  label?: string;
  badge?: number | string;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface LiquidGlassTopBarItem {
  key: string;
  label: string;
  disabled?: boolean;
  ariaLabel?: string;
}
