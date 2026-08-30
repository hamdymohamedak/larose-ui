import type { ThemeMode } from '@larose-ui/core';

export interface TabViewTokens {
  tabHeight: string;
  tabPaddingInline: string;
  tabRadius: string;
  contentRadius: string;
  contentBorder: string;
  contentBg: string;
  tabInactiveBg: string;
  tabActiveBg: string;
  insetMargin: string;
}

/**
 * Apple HIG-inspired tab view tokens (macOS NSTabView patterns).
 * @see https://developer.apple.com/design/human-interface-guidelines/tab-views
 */
export function getTabViewTokens(mode: ThemeMode): TabViewTokens {
  if (mode === 'dark') {
    return {
      tabHeight: '1.75rem',
      tabPaddingInline: '0.875rem',
      tabRadius: '0.375rem 0.375rem 0 0',
      contentRadius: '0.5rem',
      contentBorder: 'rgb(255 255 255 / 0.12)',
      contentBg: '#2c2c2e',
      tabInactiveBg: 'rgb(118 118 128 / 0.16)',
      tabActiveBg: '#2c2c2e',
      insetMargin: '1rem',
    };
  }

  return {
    tabHeight: '1.75rem',
    tabPaddingInline: '0.875rem',
    tabRadius: '0.375rem 0.375rem 0 0',
    contentRadius: '0.5rem',
    contentBorder: 'rgb(0 0 0 / 0.12)',
    contentBg: '#ffffff',
    tabInactiveBg: 'rgb(118 118 128 / 0.12)',
    tabActiveBg: '#ffffff',
    insetMargin: '1rem',
  };
}

export function tabViewTokensToCSSVariables(tokens: TabViewTokens): Record<string, string> {
  return {
    '--lr-tab-view-tab-height': tokens.tabHeight,
    '--lr-tab-view-tab-padding-inline': tokens.tabPaddingInline,
    '--lr-tab-view-tab-radius': tokens.tabRadius,
    '--lr-tab-view-content-radius': tokens.contentRadius,
    '--lr-tab-view-content-border': tokens.contentBorder,
    '--lr-tab-view-content-bg': tokens.contentBg,
    '--lr-tab-view-tab-inactive-bg': tokens.tabInactiveBg,
    '--lr-tab-view-tab-active-bg': tokens.tabActiveBg,
    '--lr-tab-view-inset-margin': tokens.insetMargin,
  };
}
