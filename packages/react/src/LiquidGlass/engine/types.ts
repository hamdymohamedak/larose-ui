import type { CSSProperties, ElementType, ReactNode } from 'react';
import type {
  LiquidGlassGeometry,
  LiquidGlassOptics,
} from '@larose-ui/liquid-glass-core';

export type {
  LiquidGlassGeometry,
  LiquidGlassOptics,
  ResolvedLiquidGlassOptics,
} from '@larose-ui/liquid-glass-core';

/** Shared chrome — every LiquidGlass component accepts direct CSS. */
export interface LiquidGlassChromeProps {
  className?: string;
  /** Inline CSS merged onto the surface. Flex / grid / padding apply to inner content. */
  style?: CSSProperties;
}

export interface LiquidGlassSurfaceProps
  extends LiquidGlassOptics, LiquidGlassGeometry, LiquidGlassChromeProps {
  children?: ReactNode;
  /**
   * Any HTML/SVG tag or custom component for the glass shell
   * (`div`, `footer`, `li`, `nav`, …). @default 'div'
   */
  as?: ElementType;
  /** Accessible label (recommended for nav/header). */
  'aria-label'?: string;
  /** Expose the displacement map data URL (for debug / lens lab). */
  onDisplacementMapChange?: (dataUrl: string) => void;
}
