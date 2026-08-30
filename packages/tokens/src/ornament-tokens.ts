import type { ThemeMode } from '@larose-ui/core';

export interface OrnamentTokens {
  offset: string;
  radius: string;
  padding: string;
  maxWidthRatio: string;
  zIndex: string;
}

/**
 * Apple HIG-inspired visionOS ornament tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/ornaments
 */
export function getOrnamentTokens(mode: ThemeMode): OrnamentTokens {
  void mode;
  return {
    offset: '0.75rem',
    radius: '1rem',
    padding: '0.5rem 0.75rem',
    maxWidthRatio: '1',
    zIndex: '10',
  };
}

export function ornamentTokensToCSSVariables(tokens: OrnamentTokens): Record<string, string> {
  return {
    '--lr-ornament-offset': tokens.offset,
    '--lr-ornament-radius': tokens.radius,
    '--lr-ornament-padding': tokens.padding,
    '--lr-ornament-max-width-ratio': tokens.maxWidthRatio,
    '--lr-ornament-z-index': tokens.zIndex,
  };
}

export const MAX_ORNAMENTS = 3;
