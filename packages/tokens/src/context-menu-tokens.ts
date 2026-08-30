import type { ThemeMode } from '@larose-ui/core';

export interface ContextMenuTokens {
  radius: string;
  shadow: string;
  minWidth: string;
  maxWidth: string;
  itemHeight: string;
  previewRadius: string;
  destructiveColor: string;
  separatorColor: string;
}

/**
 * Apple HIG-inspired context menu tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/context-menus
 */
export function getContextMenuTokens(mode: ThemeMode): ContextMenuTokens {
  if (mode === 'dark') {
    return {
      radius: '0.75rem',
      shadow: '0 12px 40px rgb(0 0 0 / 0.45)',
      minWidth: '12rem',
      maxWidth: '18rem',
      itemHeight: '2.25rem',
      previewRadius: '0.625rem',
      destructiveColor: '#ff453a',
      separatorColor: 'rgb(255 255 255 / 0.1)',
    };
  }

  return {
    radius: '0.75rem',
    shadow: '0 12px 32px rgb(0 0 0 / 0.16)',
    minWidth: '12rem',
    maxWidth: '18rem',
    itemHeight: '2.25rem',
    previewRadius: '0.625rem',
    destructiveColor: '#ff3b30',
    separatorColor: 'rgb(0 0 0 / 0.08)',
  };
}

export function contextMenuTokensToCSSVariables(
  tokens: ContextMenuTokens,
): Record<string, string> {
  return {
    '--lr-context-menu-radius': tokens.radius,
    '--lr-context-menu-shadow': tokens.shadow,
    '--lr-context-menu-min-width': tokens.minWidth,
    '--lr-context-menu-max-width': tokens.maxWidth,
    '--lr-context-menu-item-height': tokens.itemHeight,
    '--lr-context-menu-preview-radius': tokens.previewRadius,
    '--lr-context-menu-destructive': tokens.destructiveColor,
    '--lr-context-menu-separator': tokens.separatorColor,
  };
}
