import type { ThemeMode } from '@larose-ui/core';

export interface DisclosureTokens {
  triangleSize: string;
  buttonSize: string;
  hitRegion: string;
  contentGap: string;
}

/** Apple HIG-inspired disclosure control tokens. */
export function getDisclosureTokens(_mode: ThemeMode): DisclosureTokens {
  return {
    triangleSize: '0.625rem',
    buttonSize: '1.25rem',
    hitRegion: '2.75rem',
    contentGap: '0.75rem',
  };
}

export function disclosureTokensToCSSVariables(tokens: DisclosureTokens): Record<string, string> {
  return {
    '--lr-disclosure-triangle-size': tokens.triangleSize,
    '--lr-disclosure-button-size': tokens.buttonSize,
    '--lr-disclosure-hit-region': tokens.hitRegion,
    '--lr-disclosure-content-gap': tokens.contentGap,
  };
}
