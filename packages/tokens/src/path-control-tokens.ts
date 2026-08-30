import type { ThemeMode } from '@larose-ui/core';

export interface PathControlTokens {
  height: string;
  paddingX: string;
  itemGap: string;
  fontSize: string;
  separatorColor: string;
  background: string;
  foreground: string;
  itemHover: string;
}

/** @see https://developer.apple.com/design/human-interface-guidelines/path-controls */
export function getPathControlTokens(mode: ThemeMode): PathControlTokens {
  if (mode === 'dark') {
    return {
      height: '1.5rem',
      paddingX: '0.5rem',
      itemGap: '0.125rem',
      fontSize: '0.8125rem',
      separatorColor: 'rgb(255 255 255 / 0.2)',
      background: 'rgb(40 40 40 / 0.5)',
      foreground: '#f5f5f7',
      itemHover: 'rgb(255 255 255 / 0.08)',
    };
  }
  return {
    height: '1.5rem',
    paddingX: '0.5rem',
    itemGap: '0.125rem',
    fontSize: '0.8125rem',
    separatorColor: 'rgb(0 0 0 / 0.15)',
    background: 'rgb(246 246 246 / 0.8)',
    foreground: '#1d1d1f',
    itemHover: 'rgb(0 0 0 / 0.06)',
  };
}

export function pathControlTokensToCSSVariables(tokens: PathControlTokens): Record<string, string> {
  return {
    '--lr-path-control-height': tokens.height,
    '--lr-path-control-padding-x': tokens.paddingX,
    '--lr-path-control-item-gap': tokens.itemGap,
    '--lr-path-control-font-size': tokens.fontSize,
    '--lr-path-control-separator': tokens.separatorColor,
    '--lr-path-control-bg': tokens.background,
    '--lr-path-control-fg': tokens.foreground,
    '--lr-path-control-item-hover': tokens.itemHover,
  };
}
