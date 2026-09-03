import type { Density, ThemeMode } from '@larose-ui/core';

export interface ColorTokens {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  onAccent: string;
}

export interface SurfaceTokens {
  base: string;
  secondary: string;
  elevated: string;
  floating: string;
  overlay: string;
  glassBg: string;
  glassBorder: string;
  glassBlur: string;
  glassSaturation: string;
  glassShadow: string;
}

export interface TypographyRoleSpec {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export type TypographyRoleName =
  | 'display'
  | 'largeTitle'
  | 'title'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption';

export type TypographyRoles = Record<TypographyRoleName, TypographyRoleSpec>;

export interface TokenSet {
  colors: ColorTokens;
  surfaces: SurfaceTokens;
  typography: TypographyRoles;
  fontFamily: { sans: string; mono: string };
  fontSize: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>;
  fontWeight: Record<'normal' | 'medium' | 'semibold' | 'bold', string>;
  lineHeight: Record<'tight' | 'normal' | 'relaxed', string>;
  space: Record<'1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12', string>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', string>;
  shadow: Record<
    'none' | 'subtle' | 'sm' | 'md' | 'lg' | 'raised' | 'floating' | 'overlay',
    string
  >;
  duration: Record<'instant' | 'fast' | 'normal' | 'slow', string>;
  easing: Record<'default' | 'bounce' | 'sharp' | 'spring', string>;
}

export type TokenOverrides = {
  colors?: Partial<ColorTokens>;
  surfaces?: Partial<SurfaceTokens>;
  typography?: Partial<TypographyRoles>;
  fontFamily?: Partial<TokenSet['fontFamily']>;
  fontSize?: Partial<TokenSet['fontSize']>;
  fontWeight?: Partial<TokenSet['fontWeight']>;
  lineHeight?: Partial<TokenSet['lineHeight']>;
  space?: Partial<TokenSet['space']>;
  radius?: Partial<TokenSet['radius']>;
  shadow?: Partial<TokenSet['shadow']>;
  duration?: Partial<TokenSet['duration']>;
  easing?: Partial<TokenSet['easing']>;
};

export type ThemeModeInput = ThemeMode;
export type DensityInput = Density;
