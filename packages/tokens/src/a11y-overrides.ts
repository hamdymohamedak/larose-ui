import type { ThemeMode } from '@larose-ui/core';
import type { TokenOverrides } from './token-types';

/**
 * Token overrides when `prefers-contrast: more` / Increase Contrast is active.
 * @see Apple HIG — Accessibility, Color (increased contrast variants)
 */
export function getHighContrastTokenOverrides(mode: ThemeMode): TokenOverrides {
  if (mode === 'dark') {
    return {
      colors: {
        textMuted: '#aeaeb2',
        border: 'rgb(255 255 255 / 0.28)',
      },
      surfaces: {
        glassBg: '#3a3a3c',
        glassBorder: 'rgb(255 255 255 / 0.22)',
        glassBlur: '0px',
      },
    };
  }

  return {
    colors: {
      textMuted: '#48484a',
      border: 'rgb(0 0 0 / 0.18)',
    },
    surfaces: {
      glassBg: '#ffffff',
      glassBorder: 'rgb(0 0 0 / 0.14)',
      glassBlur: '0px',
    },
  };
}
