import type { ThemeMode } from '@larose-ui/core';
import type { TokenOverrides, TypographyRoles } from './token-types';

function refinedTypography(mode: ThemeMode): TypographyRoles {
  const mutedWeight = mode === 'dark' ? '400' : '400';
  return {
    display: {
      fontSize: '1.75rem',
      fontWeight: '600',
      lineHeight: '1.15',
      letterSpacing: '-0.022em',
    },
    largeTitle: {
      fontSize: '1.375rem',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.018em',
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.014em',
    },
    headline: {
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
    },
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.47',
      letterSpacing: '-0.003em',
    },
    callout: {
      fontSize: '0.9375rem',
      fontWeight: '400',
      lineHeight: '1.43',
      letterSpacing: '-0.002em',
    },
    subheadline: {
      fontSize: '0.875rem',
      fontWeight: mutedWeight,
      lineHeight: '1.38',
      letterSpacing: '-0.006em',
    },
    footnote: {
      fontSize: '0.8125rem',
      fontWeight: mutedWeight,
      lineHeight: '1.34',
      letterSpacing: '-0.004em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '500',
      lineHeight: '1.3',
      letterSpacing: '0.004em',
    },
  };
}

/**
 * Apple-inspired refined preset overrides.
 * Principles derived from Apple HIG — not proprietary assets.
 * @see docs/design/REFINED_DESIGN_LANGUAGE.md
 */
export function getRefinedTokenOverrides(mode: ThemeMode): TokenOverrides {
  if (mode === 'dark') {
    return {
      colors: {
        primary: '#0a84ff',
        primaryHover: '#409cff',
        primaryActive: '#0077ed',
        secondary: '#98989d',
        background: '#1c1c1e',
        surface: '#2c2c2e',
        surfaceElevated: '#3a3a3c',
        border: 'rgb(255 255 255 / 0.12)',
        text: '#f5f5f7',
        textMuted: '#98989d',
        textInverse: '#1c1c1e',
      },
      surfaces: {
        base: '#2c2c2e',
        secondary: '#1c1c1e',
        elevated: '#3a3a3c',
        floating: '#48484a',
        overlay: 'rgb(0 0 0 / 0.55)',
        glassBg: 'rgb(44 44 46 / 0.78)',
        glassBorder: 'rgb(255 255 255 / 0.1)',
        glassBlur: '24px',
        glassSaturation: '180%',
        glassShadow: '0 8px 32px rgb(0 0 0 / 0.35)',
      },
      radius: {
        sm: '0.4375rem',
        md: '0.5625rem',
        lg: '0.6875rem',
        xl: '0.875rem',
      },
      shadow: {
        none: 'none',
        subtle: '0 1px 2px rgb(0 0 0 / 0.24)',
        sm: '0 1px 2px rgb(0 0 0 / 0.24)',
        md: '0 4px 12px rgb(0 0 0 / 0.28)',
        lg: '0 12px 28px rgb(0 0 0 / 0.32)',
        raised: '0 4px 12px rgb(0 0 0 / 0.28)',
        floating: '0 12px 28px rgb(0 0 0 / 0.32)',
        overlay: '0 24px 48px rgb(0 0 0 / 0.4)',
      },
      typography: refinedTypography('dark'),
      duration: {
        instant: '50ms',
        fast: '120ms',
        normal: '220ms',
        slow: '320ms',
      },
      easing: {
        spring: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
      },
    };
  }

  return {
    colors: {
      primary: '#0071e3',
      primaryHover: '#0077ed',
      primaryActive: '#006edb',
      secondary: '#6e6e73',
      background: '#f5f5f7',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      border: 'rgb(0 0 0 / 0.08)',
      text: '#1d1d1f',
      textMuted: '#5c5c60',
      textInverse: '#ffffff',
    },
    surfaces: {
      base: '#ffffff',
      secondary: '#f5f5f7',
      elevated: '#ffffff',
      floating: '#ffffff',
      overlay: 'rgb(0 0 0 / 0.35)',
      glassBg: 'rgb(255 255 255 / 0.72)',
      glassBorder: 'rgb(0 0 0 / 0.06)',
      glassBlur: '20px',
      glassSaturation: '180%',
      glassShadow: '0 8px 32px rgb(0 0 0 / 0.12)',
    },
    radius: {
      sm: '0.4375rem',
      md: '0.5625rem',
      lg: '0.6875rem',
      xl: '0.875rem',
    },
    shadow: {
      none: 'none',
      subtle: '0 1px 2px rgb(0 0 0 / 0.04)',
      sm: '0 1px 2px rgb(0 0 0 / 0.04)',
      md: '0 4px 12px rgb(0 0 0 / 0.06)',
      lg: '0 12px 28px rgb(0 0 0 / 0.08)',
      raised: '0 4px 12px rgb(0 0 0 / 0.06)',
      floating: '0 12px 28px rgb(0 0 0 / 0.08)',
      overlay: '0 24px 48px rgb(0 0 0 / 0.12)',
    },
    typography: refinedTypography('light'),
    duration: {
      instant: '50ms',
      fast: '120ms',
      normal: '220ms',
      slow: '320ms',
    },
    easing: {
      spring: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
    },
  };
}
