import type { ThemeMode } from '@larose-ui/core';

export interface TextViewTokens {
  minHeight: string;
  padding: string;
  radius: string;
  bg: string;
  border: string;
  focusRing: string;
  selectionBg: string;
}

/**
 * Apple HIG-inspired text view tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/text-views
 */
export function getTextViewTokens(mode: ThemeMode): TextViewTokens {
  if (mode === 'dark') {
    return {
      minHeight: '8rem',
      padding: '0.875rem 1rem',
      radius: '0.625rem',
      bg: 'rgb(118 118 128 / 0.18)',
      border: 'transparent',
      focusRing: '0 0 0 3px rgb(10 132 255 / 0.35)',
      selectionBg: 'rgb(10 132 255 / 0.35)',
    };
  }

  return {
    minHeight: '8rem',
    padding: '0.875rem 1rem',
    radius: '0.625rem',
    bg: 'rgb(118 118 128 / 0.08)',
    border: 'transparent',
    focusRing: '0 0 0 3px rgb(0 113 227 / 0.25)',
    selectionBg: 'rgb(0 113 227 / 0.22)',
  };
}

export function textViewTokensToCSSVariables(tokens: TextViewTokens): Record<string, string> {
  return {
    '--lr-text-view-min-height': tokens.minHeight,
    '--lr-text-view-padding': tokens.padding,
    '--lr-text-view-radius': tokens.radius,
    '--lr-text-view-bg': tokens.bg,
    '--lr-text-view-border': tokens.border,
    '--lr-text-view-focus-ring': tokens.focusRing,
    '--lr-text-view-selection-bg': tokens.selectionBg,
  };
}
