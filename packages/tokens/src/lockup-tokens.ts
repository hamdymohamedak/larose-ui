import type { ThemeMode } from '@larose-ui/core';

export interface LockupTokens {
  gap: string;
  focusScale: string;
  focusShadow: string;
  focusTilt: string;
  cardRadius: string;
  monogramSize: string;
  posterRadius: string;
  captionRadius: string;
}

/**
 * Apple HIG-inspired lockup tokens (tvOS patterns adapted for focusable web UI).
 * @see https://developer.apple.com/design/human-interface-guidelines/lockups
 */
export function getLockupTokens(mode: ThemeMode): LockupTokens {
  if (mode === 'dark') {
    return {
      gap: '1.5rem',
      focusScale: '1.08',
      focusShadow: '0 16px 40px rgb(0 0 0 / 0.45)',
      focusTilt: '4deg',
      cardRadius: '0.75rem',
      monogramSize: '5rem',
      posterRadius: '0.625rem',
      captionRadius: '0.625rem',
    };
  }

  return {
    gap: '1.5rem',
    focusScale: '1.06',
    focusShadow: '0 12px 32px rgb(0 0 0 / 0.18)',
    focusTilt: '3deg',
    cardRadius: '0.75rem',
    monogramSize: '5rem',
    posterRadius: '0.625rem',
    captionRadius: '0.625rem',
  };
}

export function lockupTokensToCSSVariables(tokens: LockupTokens): Record<string, string> {
  return {
    '--lr-lockup-gap': tokens.gap,
    '--lr-lockup-focus-scale': tokens.focusScale,
    '--lr-lockup-focus-shadow': tokens.focusShadow,
    '--lr-lockup-focus-tilt': tokens.focusTilt,
    '--lr-lockup-card-radius': tokens.cardRadius,
    '--lr-lockup-monogram-size': tokens.monogramSize,
    '--lr-lockup-poster-radius': tokens.posterRadius,
    '--lr-lockup-caption-radius': tokens.captionRadius,
  };
}
