import type { ThemeMode } from '@larose-ui/core';

export interface ImageViewTokens {
  radius: string;
  placeholderBg: string;
  overlayScrim: string;
  overlayTextShadow: string;
  wellBorder: string;
  wellBg: string;
}

/**
 * Apple HIG-inspired image view tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/image-views
 */
export function getImageViewTokens(mode: ThemeMode): ImageViewTokens {
  if (mode === 'dark') {
    return {
      radius: '0.625rem',
      placeholderBg: '#2c2c2e',
      overlayScrim: 'linear-gradient(180deg, rgb(0 0 0 / 0) 35%, rgb(0 0 0 / 0.72) 100%)',
      overlayTextShadow: '0 1px 8px rgb(0 0 0 / 0.55)',
      wellBorder: 'rgb(255 255 255 / 0.12)',
      wellBg: 'rgb(118 118 128 / 0.18)',
    };
  }

  return {
    radius: '0.625rem',
    placeholderBg: '#e8e8ed',
    overlayScrim: 'linear-gradient(180deg, rgb(0 0 0 / 0) 35%, rgb(0 0 0 / 0.62) 100%)',
    overlayTextShadow: '0 1px 6px rgb(0 0 0 / 0.45)',
    wellBorder: 'rgb(0 0 0 / 0.08)',
    wellBg: 'rgb(118 118 128 / 0.08)',
  };
}

export function imageViewTokensToCSSVariables(tokens: ImageViewTokens): Record<string, string> {
  return {
    '--lr-image-radius': tokens.radius,
    '--lr-image-placeholder-bg': tokens.placeholderBg,
    '--lr-image-overlay-scrim': tokens.overlayScrim,
    '--lr-image-overlay-text-shadow': tokens.overlayTextShadow,
    '--lr-image-well-border': tokens.wellBorder,
    '--lr-image-well-bg': tokens.wellBg,
  };
}
