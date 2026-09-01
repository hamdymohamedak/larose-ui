import type { ThemeMode } from '@larose-ui/core';

export interface TabBarTokens {
  height: string;
  heightCompact: string;
  itemPadding: string;
  iconSize: string;
  labelSize: string;
  radius: string;
  background: string;
  foreground: string;
  inactiveFg: string;
  badgeBg: string;
  badgeFg: string;
  liquidGlassBg: string;
  liquidGlassActiveBg: string;
  liquidGlassGlow: string;
}

/** @see https://developer.apple.com/design/human-interface-guidelines/tab-bars */
export function getTabBarTokens(mode: ThemeMode): TabBarTokens {
  if (mode === 'dark') {
    return {
      height: '3.125rem',
      heightCompact: '2.75rem',
      itemPadding: '0.375rem',
      iconSize: '1.375rem',
      labelSize: '0.625rem',
      radius: '1rem',
      background: 'rgb(30 30 30 / 0.72)',
      foreground: '#0a84ff',
      inactiveFg: '#8e8e93',
      badgeBg: '#ff453a',
      badgeFg: '#ffffff',
      liquidGlassBg: 'rgb(44 44 46 / 0.55)',
      liquidGlassActiveBg: 'rgb(72 72 74 / 0.82)',
      liquidGlassGlow: '0 4px 20px rgb(255 105 180 / 0.18)',
    };
  }
  return {
    height: '3.125rem',
    heightCompact: '2.75rem',
    itemPadding: '0.375rem',
    iconSize: '1.375rem',
    labelSize: '0.625rem',
    radius: '1rem',
    background: 'rgb(255 255 255 / 0.72)',
    foreground: '#0071e3',
    inactiveFg: '#8e8e93',
    badgeBg: '#ff3b30',
    badgeFg: '#ffffff',
    liquidGlassBg: 'rgb(255 255 255 / 0.45)',
    liquidGlassActiveBg: 'rgb(255 255 255 / 0.78)',
    liquidGlassGlow: '0 4px 20px rgb(236 72 153 / 0.14)',
  };
}

export function tabBarTokensToCSSVariables(tokens: TabBarTokens): Record<string, string> {
  return {
    '--lr-tab-bar-height': tokens.height,
    '--lr-tab-bar-height-compact': tokens.heightCompact,
    '--lr-tab-bar-item-padding': tokens.itemPadding,
    '--lr-tab-bar-icon-size': tokens.iconSize,
    '--lr-tab-bar-label-size': tokens.labelSize,
    '--lr-tab-bar-radius': tokens.radius,
    '--lr-tab-bar-bg': tokens.background,
    '--lr-tab-bar-fg': tokens.foreground,
    '--lr-tab-bar-inactive-fg': tokens.inactiveFg,
    '--lr-tab-bar-badge-bg': tokens.badgeBg,
    '--lr-tab-bar-badge-fg': tokens.badgeFg,
    '--lr-tab-bar-liquid-glass-bg': tokens.liquidGlassBg,
    '--lr-tab-bar-liquid-glass-active-bg': tokens.liquidGlassActiveBg,
    '--lr-tab-bar-liquid-glass-glow': tokens.liquidGlassGlow,
  };
}

export const MAX_TAB_BAR_ITEMS = 5;
