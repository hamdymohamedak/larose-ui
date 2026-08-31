import type { ThemeMode } from '@larose-ui/core';

export interface DrawerTokens {
  width: string;
  shadow: string;
  background: string;
  overlay: string;
  padding: string;
  titleSize: string;
  descriptionSize: string;
}

export function getDrawerTokens(mode: ThemeMode): DrawerTokens {
  if (mode === 'dark') {
    return {
      width: 'min(24rem, 100vw)',
      shadow: 'var(--lr-shadow-lg)',
      background: 'var(--lr-color-surface-elevated)',
      overlay: 'rgb(0 0 0 / 0.55)',
      padding: 'var(--lr-space-6)',
      titleSize: 'var(--lr-font-size-xl)',
      descriptionSize: 'var(--lr-font-size-sm)',
    };
  }

  return {
    width: 'min(24rem, 100vw)',
    shadow: 'var(--lr-shadow-lg)',
    background: 'var(--lr-color-surface-elevated)',
    overlay: 'rgb(0 0 0 / 0.45)',
    padding: 'var(--lr-space-6)',
    titleSize: 'var(--lr-font-size-xl)',
    descriptionSize: 'var(--lr-font-size-sm)',
  };
}

export function drawerTokensToCSSVariables(tokens: DrawerTokens): Record<string, string> {
  return {
    '--lr-drawer-width': tokens.width,
    '--lr-drawer-shadow': tokens.shadow,
    '--lr-drawer-background': tokens.background,
    '--lr-drawer-overlay': tokens.overlay,
    '--lr-drawer-padding': tokens.padding,
    '--lr-drawer-title-size': tokens.titleSize,
    '--lr-drawer-description-size': tokens.descriptionSize,
  };
}
