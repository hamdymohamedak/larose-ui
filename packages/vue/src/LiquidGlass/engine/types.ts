import type { LiquidGlassSurfaceBaseProps } from '@larose-ui/liquid-glass-core';

export type {
  LiquidGlassChromeProps,
  LiquidGlassGeometry,
  LiquidGlassOptics,
  LiquidGlassStyle,
  LiquidGlassTabItem,
  LiquidGlassTopBarItem,
  ResolvedLiquidGlassOptics,
} from '@larose-ui/liquid-glass-core';

/** Vue surface props — extends shared base with native control attributes. */
export interface LiquidGlassSurfaceProps extends LiquidGlassSurfaceBaseProps {
  type?: string;
  disabled?: boolean;
}
