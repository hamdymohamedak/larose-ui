import type { ThemeMode } from '@larose-ui/core';

export interface SearchFieldTokens {
  height: string;
  radius: string;
  paddingX: string;
  fontSize: string;
  background: string;
  foreground: string;
  placeholder: string;
  scopeHeight: string;
  tokenRadius: string;
  tokenBg: string;
}

/** @see https://developer.apple.com/design/human-interface-guidelines/search-fields */
export function getSearchFieldTokens(mode: ThemeMode): SearchFieldTokens {
  if (mode === 'dark') {
    return {
      height: '1.75rem',
      radius: '0.5rem',
      paddingX: '0.625rem',
      fontSize: '0.8125rem',
      background: 'rgb(118 118 128 / 0.24)',
      foreground: '#f5f5f7',
      placeholder: 'rgb(235 235 245 / 0.6)',
      scopeHeight: '1.75rem',
      tokenRadius: '0.375rem',
      tokenBg: 'rgb(10 132 255 / 0.25)',
    };
  }
  return {
    height: '1.75rem',
    radius: '0.5rem',
    paddingX: '0.625rem',
    fontSize: '0.8125rem',
    background: 'rgb(118 118 128 / 0.12)',
    foreground: '#1d1d1f',
    placeholder: 'rgb(60 60 67 / 0.6)',
    scopeHeight: '1.75rem',
    tokenRadius: '0.375rem',
    tokenBg: 'rgb(0 113 227 / 0.12)',
  };
}

export function searchFieldTokensToCSSVariables(tokens: SearchFieldTokens): Record<string, string> {
  return {
    '--lr-search-field-height': tokens.height,
    '--lr-search-field-radius': tokens.radius,
    '--lr-search-field-padding-x': tokens.paddingX,
    '--lr-search-field-font-size': tokens.fontSize,
    '--lr-search-field-bg': tokens.background,
    '--lr-search-field-fg': tokens.foreground,
    '--lr-search-field-placeholder': tokens.placeholder,
    '--lr-search-field-scope-height': tokens.scopeHeight,
    '--lr-search-field-token-radius': tokens.tokenRadius,
    '--lr-search-field-token-bg': tokens.tokenBg,
  };
}
