import type { ThemeMode } from '@larose-ui/core';

export interface MenuTokens {
  radius: string;
  shadow: string;
  minWidth: string;
  maxWidth: string;
  itemHeight: string;
  compactTileSize: string;
  separatorColor: string;
  destructiveColor: string;
  checkmarkWidth: string;
  shortcutColor: string;
  shortcutFontSize: string;
  shortcutSpacing: string;
}

/**
 * Apple HIG-inspired menu tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/menus
 */
export function getMenuTokens(mode: ThemeMode): MenuTokens {
  if (mode === 'dark') {
    return {
      radius: '0.75rem',
      shadow: '0 12px 40px rgb(0 0 0 / 0.45)',
      minWidth: '12rem',
      maxWidth: '20rem',
      itemHeight: '2.25rem',
      compactTileSize: '2.75rem',
      separatorColor: 'rgb(255 255 255 / 0.1)',
      destructiveColor: '#ff453a',
      checkmarkWidth: '1.125rem',
      shortcutColor: 'rgb(255 255 255 / 0.45)',
      shortcutFontSize: '0.75rem',
      shortcutSpacing: '1.5rem',
    };
  }

  return {
    radius: '0.75rem',
    shadow: '0 12px 32px rgb(0 0 0 / 0.16)',
    minWidth: '12rem',
    maxWidth: '20rem',
    itemHeight: '2.25rem',
    compactTileSize: '2.75rem',
    separatorColor: 'rgb(0 0 0 / 0.08)',
    destructiveColor: '#ff3b30',
    checkmarkWidth: '1.125rem',
    shortcutColor: 'rgb(0 0 0 / 0.45)',
    shortcutFontSize: '0.75rem',
    shortcutSpacing: '1.5rem',
  };
}

export function menuTokensToCSSVariables(tokens: MenuTokens): Record<string, string> {
  return {
    '--lr-menu-radius': tokens.radius,
    '--lr-menu-shadow': tokens.shadow,
    '--lr-menu-min-width': tokens.minWidth,
    '--lr-menu-max-width': tokens.maxWidth,
    '--lr-menu-item-height': tokens.itemHeight,
    '--lr-menu-compact-tile-size': tokens.compactTileSize,
    '--lr-menu-separator': tokens.separatorColor,
    '--lr-menu-destructive': tokens.destructiveColor,
    '--lr-menu-checkmark-width': tokens.checkmarkWidth,
    '--lr-menu-shortcut-color': tokens.shortcutColor,
    '--lr-menu-shortcut-font-size': tokens.shortcutFontSize,
    '--lr-menu-shortcut-spacing': tokens.shortcutSpacing,
  };
}
