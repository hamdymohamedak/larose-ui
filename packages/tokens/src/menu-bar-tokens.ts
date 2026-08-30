import type { ThemeMode } from '@larose-ui/core';

export interface MenuBarTokens {
  height: string;
  paddingX: string;
  itemPaddingX: string;
  fontSize: string;
  extraSize: string;
  background: string;
  foreground: string;
  itemHover: string;
  itemActive: string;
  separator: string;
  shadow: string;
}

/**
 * Apple HIG-inspired menu bar tokens (macOS and iPadOS).
 * @see https://developer.apple.com/design/human-interface-guidelines/the-menu-bar
 */
export function getMenuBarTokens(mode: ThemeMode): MenuBarTokens {
  if (mode === 'dark') {
    return {
      height: '1.5rem',
      paddingX: '0.5rem',
      itemPaddingX: '0.625rem',
      fontSize: '0.8125rem',
      extraSize: '1rem',
      background: 'rgb(40 40 40 / 0.82)',
      foreground: '#f5f5f7',
      itemHover: 'rgb(255 255 255 / 0.08)',
      itemActive: 'rgb(255 255 255 / 0.14)',
      separator: 'rgb(255 255 255 / 0.12)',
      shadow: '0 1px 0 rgb(0 0 0 / 0.35)',
    };
  }

  return {
    height: '1.5rem',
    paddingX: '0.5rem',
    itemPaddingX: '0.625rem',
    fontSize: '0.8125rem',
    extraSize: '1rem',
    background: 'rgb(246 246 246 / 0.84)',
    foreground: '#1d1d1f',
    itemHover: 'rgb(0 0 0 / 0.06)',
    itemActive: 'rgb(0 0 0 / 0.1)',
    separator: 'rgb(0 0 0 / 0.08)',
    shadow: '0 1px 0 rgb(255 255 255 / 0.6)',
  };
}

export function menuBarTokensToCSSVariables(tokens: MenuBarTokens): Record<string, string> {
  return {
    '--lr-menu-bar-height': tokens.height,
    '--lr-menu-bar-padding-x': tokens.paddingX,
    '--lr-menu-bar-item-padding-x': tokens.itemPaddingX,
    '--lr-menu-bar-font-size': tokens.fontSize,
    '--lr-menu-bar-extra-size': tokens.extraSize,
    '--lr-menu-bar-bg': tokens.background,
    '--lr-menu-bar-fg': tokens.foreground,
    '--lr-menu-bar-item-hover': tokens.itemHover,
    '--lr-menu-bar-item-active': tokens.itemActive,
    '--lr-menu-bar-separator': tokens.separator,
    '--lr-menu-bar-shadow': tokens.shadow,
  };
}

/** Standard top-level menu order per Apple HIG. */
export const STANDARD_MENU_BAR_ORDER = [
  'app',
  'file',
  'edit',
  'format',
  'view',
  'window',
  'help',
] as const;

export type StandardMenuBarSlot = (typeof STANDARD_MENU_BAR_ORDER)[number];
