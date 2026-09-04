import type { ThemeMode } from '@larose-ui/core';

export interface DockMenuTokens {
  iconSize: string;
  menuOffset: string;
  dockHeight: string;
  dockRadius: string;
  quickActionIconSize: string;
  background: string;
}

/**
 * Apple HIG-inspired Dock menu tokens (macOS).
 * @see https://developer.apple.com/design/human-interface-guidelines/dock-menus
 */
export function getDockMenuTokens(mode: ThemeMode): DockMenuTokens {
  if (mode === 'dark') {
    return {
      iconSize: '3.25rem',
      menuOffset: '0.5rem',
      dockHeight: '4.25rem',
      dockRadius: '1rem',
      quickActionIconSize: '3.5rem',
      background: 'rgb(44 44 46 / 0.72)',
    };
  }
  return {
    iconSize: '3.25rem',
    menuOffset: '0.5rem',
    dockHeight: '4.25rem',
    dockRadius: '1rem',
    quickActionIconSize: '3.5rem',
    background: 'rgb(255 255 255 / 0.55)',
  };
}

export function dockMenuTokensToCSSVariables(tokens: DockMenuTokens): Record<string, string> {
  return {
    '--lr-dock-icon-size': tokens.iconSize,
    '--lr-dock-menu-offset': tokens.menuOffset,
    '--lr-dock-height': tokens.dockHeight,
    '--lr-dock-radius': tokens.dockRadius,
    '--lr-dock-bg': tokens.background,
    '--lr-quick-action-icon-size': tokens.quickActionIconSize,
  };
}
