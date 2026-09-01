import type { ReactNode } from 'react';

export type TabBarPlatform = 'ios' | 'ipados' | 'visionos' | 'tvos';

export type TabBarVariant = 'tabBarOnly' | 'sidebarAdaptable';

export type TabBarSearchStyle = 'standard' | 'button';

export interface TabBarProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  platform?: TabBarPlatform;
  variant?: TabBarVariant;
  /** Floating Liquid Glass material with a morphing selection pill on the active tab. */
  liquidGlass?: boolean;
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
