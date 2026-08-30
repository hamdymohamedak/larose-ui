import type { ThemeMode } from '@larose-ui/core';

export interface QuickActionsTokens {
  iconSize: string;
  rowMinHeight: string;
  menuMinWidth: string;
  menuRadius: string;
  menuShadow: string;
  actionIconSize: string;
}

/** Apple HIG-inspired Home Screen quick action tokens (iOS/iPadOS). */
export function getQuickActionsTokens(mode: ThemeMode): QuickActionsTokens {
  void mode;
  return {
    iconSize: '3.75rem',
    rowMinHeight: '2.75rem',
    menuMinWidth: '15rem',
    menuRadius: '0.875rem',
    menuShadow: '0 12px 40px rgb(0 0 0 / 0.18)',
    actionIconSize: '1.375rem',
  };
}

export function quickActionsTokensToCSSVariables(
  tokens: QuickActionsTokens,
): Record<string, string> {
  return {
    '--lr-quick-action-icon-size': tokens.iconSize,
    '--lr-quick-action-row-height': tokens.rowMinHeight,
    '--lr-quick-action-menu-min-width': tokens.menuMinWidth,
    '--lr-quick-action-menu-radius': tokens.menuRadius,
    '--lr-quick-action-menu-shadow': tokens.menuShadow,
    '--lr-quick-action-symbol-size': tokens.actionIconSize,
  };
}

export const MAX_HOME_SCREEN_QUICK_ACTIONS = 4;
