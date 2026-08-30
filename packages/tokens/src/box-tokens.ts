import type { ThemeMode } from '@larose-ui/core';

export interface BoxTokens {
  radius: string;
  secondaryBg: string;
  tertiaryBg: string;
  border: string;
  titleSize: string;
  titleWeight: string;
  maxWidth: string;
}

/** Apple HIG-inspired box tokens. */
export function getBoxTokens(mode: ThemeMode): BoxTokens {
  if (mode === 'dark') {
    return {
      radius: '0.625rem',
      secondaryBg: 'rgb(118 118 128 / 0.24)',
      tertiaryBg: 'rgb(118 118 128 / 0.16)',
      border: 'rgb(255 255 255 / 0.08)',
      titleSize: '0.8125rem',
      titleWeight: '600',
      maxWidth: '40rem',
    };
  }

  return {
    radius: '0.625rem',
    secondaryBg: 'rgb(118 118 128 / 0.12)',
    tertiaryBg: 'rgb(118 118 128 / 0.08)',
    border: 'rgb(0 0 0 / 0.06)',
    titleSize: '0.8125rem',
    titleWeight: '600',
    maxWidth: '40rem',
  };
}

export function boxTokensToCSSVariables(tokens: BoxTokens): Record<string, string> {
  return {
    '--lr-box-radius': tokens.radius,
    '--lr-box-secondary-bg': tokens.secondaryBg,
    '--lr-box-tertiary-bg': tokens.tertiaryBg,
    '--lr-box-border': tokens.border,
    '--lr-box-title-size': tokens.titleSize,
    '--lr-box-title-weight': tokens.titleWeight,
    '--lr-box-max-width': tokens.maxWidth,
  };
}
