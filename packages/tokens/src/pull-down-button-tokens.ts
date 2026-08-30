import type { ThemeMode } from '@larose-ui/core';

export interface PullDownButtonTokens {
  minWidth: string;
  height: string;
  radius: string;
  moreSize: string;
}

/**
 * Apple HIG-inspired pull-down button tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons
 */
export function getPullDownButtonTokens(mode: ThemeMode): PullDownButtonTokens {
  void mode;
  return {
    minWidth: '6rem',
    height: '2.25rem',
    radius: '0.5rem',
    moreSize: '2.25rem',
  };
}

export function pullDownButtonTokensToCSSVariables(
  tokens: PullDownButtonTokens,
): Record<string, string> {
  return {
    '--lr-pulldown-min-width': tokens.minWidth,
    '--lr-pulldown-height': tokens.height,
    '--lr-pulldown-radius': tokens.radius,
    '--lr-pulldown-more-size': tokens.moreSize,
  };
}

export const MIN_PULLDOWN_ITEMS = 3;
