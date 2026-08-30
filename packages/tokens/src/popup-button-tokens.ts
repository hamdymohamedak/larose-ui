import type { ThemeMode } from '@larose-ui/core';

export interface PopUpButtonTokens {
  minWidth: string;
  height: string;
  radius: string;
  chevronSize: string;
}

/**
 * Apple HIG-inspired pop-up button tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons
 */
export function getPopUpButtonTokens(mode: ThemeMode): PopUpButtonTokens {
  void mode;
  return {
    minWidth: '8rem',
    height: '2.25rem',
    radius: '0.5rem',
    chevronSize: '0.75rem',
  };
}

export function popUpButtonTokensToCSSVariables(
  tokens: PopUpButtonTokens,
): Record<string, string> {
  return {
    '--lr-popup-min-width': tokens.minWidth,
    '--lr-popup-height': tokens.height,
    '--lr-popup-radius': tokens.radius,
    '--lr-popup-chevron-size': tokens.chevronSize,
  };
}
