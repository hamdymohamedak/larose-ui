import type { Snippet } from 'svelte';
import type { Density, ThemeMode } from '@larose-ui/core';
import type { ColorTokens } from '@larose-ui/tokens';
import type { ComponentConfiguration, LaRoseTheme, LaRoseThemeInput } from '@larose-ui/themes';

export interface LaRoseProviderProps {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  themeConfig?: LaRoseThemeInput | LaRoseTheme;
  components?: ComponentConfiguration;
  children: Snippet;
}

export interface RuntimeProviderProps {
  initialContext?: Partial<import('@larose-ui/core').LaRoseRuntimeContext>;
  onEvent?: (event: import('@larose-ui/core').RuntimeEvent) => void;
  children: Snippet;
}

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type LabelImportance = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
export type ProgressVariant = 'default' | 'success' | 'error';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface SelectOption {
  label: string;
  value: string;
}
