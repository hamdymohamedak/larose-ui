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
}

export interface TokenSet {
  colors: ColorTokens;
  fontFamily: { sans: string; mono: string };
  fontSize: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>;
  fontWeight: Record<'normal' | 'medium' | 'semibold' | 'bold', string>;
  lineHeight: Record<'tight' | 'normal' | 'relaxed', string>;
  space: Record<'1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12', string>;
  radius: Record<'sm' | 'md' | 'lg' | 'full', string>;
  shadow: Record<'sm' | 'md' | 'lg', string>;
  duration: Record<'fast' | 'normal' | 'slow', string>;
  easing: Record<'default' | 'bounce' | 'sharp', string>;
}

const lightColors: ColorTokens = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryActive: '#1e40af',
  secondary: '#64748b',
  success: '#16a34a',
  warning: '#ca8a04',
  error: '#dc2626',
  info: '#0891b2',
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceElevated: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  textInverse: '#ffffff',
};

const darkColors: ColorTokens = {
  primary: '#3b82f6',
  primaryHover: '#60a5fa',
  primaryActive: '#2563eb',
  secondary: '#94a3b8',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#06b6d4',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceElevated: '#334155',
  border: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textInverse: '#0f172a',
};

const baseTokens: Omit<TokenSet, 'colors'> = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  space: {
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  duration: {
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

export const densityMultipliers: Record<Density, number> = {
  compact: 0.85,
  comfortable: 1,
  spacious: 1.15,
};

export function getTokens(mode: ThemeMode = 'light'): TokenSet {
  return {
    ...baseTokens,
    colors: mode === 'dark' ? darkColors : lightColors,
  };
}

export function tokensToCSSVariables(
  tokens: TokenSet,
  density: Density = 'comfortable',
): Record<string, string> {
  const multiplier = densityMultipliers[density];
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(tokens.colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    vars[`--lr-color-${cssKey}`] = value;
  }

  vars['--lr-font-family-sans'] = tokens.fontFamily.sans;
  vars['--lr-font-family-mono'] = tokens.fontFamily.mono;

  for (const [key, value] of Object.entries(tokens.fontSize)) {
    vars[`--lr-font-size-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.fontWeight)) {
    vars[`--lr-font-weight-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.lineHeight)) {
    vars[`--lr-line-height-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.space)) {
    const num = parseFloat(value);
    const unit = value.replace(String(num), '');
    vars[`--lr-space-${key}`] = `${num * multiplier}${unit}`;
  }

  for (const [key, value] of Object.entries(tokens.radius)) {
    vars[`--lr-radius-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.shadow)) {
    vars[`--lr-shadow-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.duration)) {
    vars[`--lr-duration-${key}`] = value;
  }

  for (const [key, value] of Object.entries(tokens.easing)) {
    vars[`--lr-easing-${key}`] = value;
  }

  vars['--lr-density-multiplier'] = String(multiplier);

  return vars;
}

export function applyTokensToElement(
  element: HTMLElement,
  mode: ThemeMode = 'light',
  density: Density = 'comfortable',
  brandOverrides?: Partial<ColorTokens>,
): void {
  const tokens = getTokens(mode);
  if (brandOverrides) {
    tokens.colors = { ...tokens.colors, ...brandOverrides };
  }
  const vars = tokensToCSSVariables(tokens, density);
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value);
  }
  element.dataset.lrTheme = mode;
  element.dataset.lrDensity = density;
}

export function createTenantTheme(
  tenantId: string,
  brandColors: Partial<ColorTokens>,
): { tenantId: string; colors: Partial<ColorTokens> } {
  return { tenantId, colors: brandColors };
}
