import type { ReactNode } from 'react';
import type { LiquidGlassProps } from '@larose-ui/glass';

export type TabBarPlatform = 'ios' | 'ipados' | 'visionos' | 'tvos';

export type TabBarVariant = 'tabBarOnly' | 'sidebarAdaptable';

export type TabBarSearchStyle = 'standard' | 'button';

export interface TabBarProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  platform?: TabBarPlatform;
  variant?: TabBarVariant;
  /**
   * Floating liquid glass capsule with a displacement-mapped selection lens.
   * Pass `true` for defaults or an object with optical props (width, height, borderRadius,
   * scale, depth, curvature, splay, chroma, blur, glow, edgeHighlight, specularAngle).
   */
  liquidGlass?: boolean | LiquidGlassProps;
  /** iOS: search as trailing tab. */
  searchTab?: {
    style?: TabBarSearchStyle;
    label?: string;
    icon?: ReactNode;
  };
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

export interface TabBarListProps {
  children: ReactNode;
}

export interface TabBarItemProps {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: number | '!';
  disabled?: boolean;
}

export interface TabBarPanelProps {
  value: string;
  children: ReactNode;
}
