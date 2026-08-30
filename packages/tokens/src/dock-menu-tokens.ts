import type { ThemeMode } from '@larose-ui/core';

export interface DockMenuTokens {
  iconSize: string;
  menuOffset: string;
  dockHeight: string;
  dockRadius: string;
  quickActionIconSize: string;
}

/**
 * Apple HIG-inspired Dock menu tokens (macOS).
 * @see https://developer.apple.com/design/human-interface-guidelines/dock-menus
 */
export function getDockMenuTokens(mode: ThemeMode): DockMenuTokens {
  void mode;
  return {
    iconSize: '3.25rem',
    menuOffset: '0.5rem',
    dockHeight: '4.25rem',
    dockRadius: '1rem',
    quickActionIconSize: '3.5rem',
  };
}

export function dockMenuTokensToCSSVariables(tokens: DockMenuTokens): Record<string, string> {
  return {
    '--lr-dock-icon-size': tokens.iconSize,
    '--lr-dock-menu-offset': tokens.menuOffset,
    '--lr-dock-height': tokens.dockHeight,
    '--lr-dock-radius': tokens.dockRadius,
    '--lr-quick-action-icon-size': tokens.quickActionIconSize,
  };
}
