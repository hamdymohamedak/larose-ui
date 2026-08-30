import type { ThemeMode } from '@larose-ui/core';

export interface LabelTokens {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  selectionBg: string;
}

/**
 * Apple HIG system label colors.
 * @see https://developer.apple.com/design/human-interface-guidelines/labels
 */
export function getLabelTokens(mode: ThemeMode): LabelTokens {
  if (mode === 'dark') {
    return {
      primary: '#ffffff',
      secondary: 'rgb(235 235 245 / 0.6)',
      tertiary: 'rgb(235 235 245 / 0.3)',
      quaternary: 'rgb(235 235 245 / 0.18)',
      selectionBg: 'rgb(10 132 255 / 0.35)',
    };
  }

  return {
    primary: '#000000',
    secondary: 'rgb(60 60 67 / 0.6)',
    tertiary: 'rgb(60 60 67 / 0.3)',
    quaternary: 'rgb(60 60 67 / 0.18)',
    selectionBg: 'rgb(0 113 227 / 0.22)',
  };
}

export function labelTokensToCSSVariables(tokens: LabelTokens): Record<string, string> {
  return {
    '--lr-label-primary': tokens.primary,
    '--lr-label-secondary': tokens.secondary,
    '--lr-label-tertiary': tokens.tertiary,
    '--lr-label-quaternary': tokens.quaternary,
    '--lr-label-selection-bg': tokens.selectionBg,
  };
}
