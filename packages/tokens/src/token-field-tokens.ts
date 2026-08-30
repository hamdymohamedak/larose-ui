import type { ThemeMode } from '@larose-ui/core';

export interface TokenFieldTokens {
  minHeight: string;
  radius: string;
  padding: string;
  tokenRadius: string;
  tokenBg: string;
  tokenFg: string;
  fontSize: string;
  background: string;
  border: string;
}

/** @see https://developer.apple.com/design/human-interface-guidelines/token-fields */
export function getTokenFieldTokens(mode: ThemeMode): TokenFieldTokens {
  if (mode === 'dark') {
    return {
      minHeight: '2rem',
      radius: '0.4375rem',
      padding: '0.25rem 0.375rem',
      tokenRadius: '0.3125rem',
      tokenBg: 'rgb(10 132 255 / 0.28)',
      tokenFg: '#f5f5f7',
      fontSize: '0.8125rem',
      background: 'rgb(40 40 40 / 0.6)',
      border: 'rgb(255 255 255 / 0.12)',
    };
  }
  return {
    minHeight: '2rem',
    radius: '0.4375rem',
    padding: '0.25rem 0.375rem',
    tokenRadius: '0.3125rem',
    tokenBg: 'rgb(0 113 227 / 0.12)',
    tokenFg: '#1d1d1f',
    fontSize: '0.8125rem',
    background: '#ffffff',
    border: 'rgb(0 0 0 / 0.12)',
  };
}

export function tokenFieldTokensToCSSVariables(tokens: TokenFieldTokens): Record<string, string> {
  return {
    '--lr-token-field-min-height': tokens.minHeight,
    '--lr-token-field-radius': tokens.radius,
    '--lr-token-field-padding': tokens.padding,
    '--lr-token-field-token-radius': tokens.tokenRadius,
    '--lr-token-field-token-bg': tokens.tokenBg,
    '--lr-token-field-token-fg': tokens.tokenFg,
    '--lr-token-field-font-size': tokens.fontSize,
    '--lr-token-field-bg': tokens.background,
    '--lr-token-field-border': tokens.border,
  };
}

export const DEFAULT_TOKEN_DELIMITERS = [','] as const;
