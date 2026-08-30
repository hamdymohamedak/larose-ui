import type { ThemeMode } from '@larose-ui/core';

export interface ToolbarTokens {
  height: string;
  heightLargeTitle: string;
  paddingX: string;
  sectionGap: string;
  itemSize: string;
  itemRadius: string;
  itemGap: string;
  fixedSpace: string;
  titleMaxWidth: string;
  titleFontSize: string;
  titleFontWeight: string;
  largeTitleFontSize: string;
  searchMinWidth: string;
  searchHeight: string;
  background: string;
  foreground: string;
  itemHover: string;
  itemActive: string;
  separator: string;
  prominentBg: string;
  prominentFg: string;
  blur: string;
}

/**
 * Apple HIG-inspired toolbar tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/toolbars
 */
export function getToolbarTokens(mode: ThemeMode): ToolbarTokens {
  if (mode === 'dark') {
    return {
      height: '2.75rem',
      heightLargeTitle: '6rem',
      paddingX: '0.75rem',
      sectionGap: '0.75rem',
      itemSize: '2rem',
      itemRadius: '0.4375rem',
      itemGap: '0.25rem',
      fixedSpace: '0.75rem',
      titleMaxWidth: '12rem',
      titleFontSize: '0.9375rem',
      titleFontWeight: '600',
      largeTitleFontSize: '2rem',
      searchMinWidth: '10rem',
      searchHeight: '1.75rem',
      background: 'rgb(30 30 30 / 0.72)',
      foreground: '#f5f5f7',
      itemHover: 'rgb(255 255 255 / 0.08)',
      itemActive: 'rgb(255 255 255 / 0.14)',
      separator: 'rgb(255 255 255 / 0.12)',
      prominentBg: '#0a84ff',
      prominentFg: '#ffffff',
      blur: '20px',
    };
  }

  return {
    height: '2.75rem',
    heightLargeTitle: '6rem',
    paddingX: '0.75rem',
    sectionGap: '0.75rem',
    itemSize: '2rem',
    itemRadius: '0.4375rem',
    itemGap: '0.25rem',
    fixedSpace: '0.75rem',
    titleMaxWidth: '12rem',
    titleFontSize: '0.9375rem',
    titleFontWeight: '600',
    largeTitleFontSize: '2rem',
    searchMinWidth: '10rem',
    searchHeight: '1.75rem',
    background: 'rgb(255 255 255 / 0.72)',
    foreground: '#1d1d1f',
    itemHover: 'rgb(0 0 0 / 0.06)',
    itemActive: 'rgb(0 0 0 / 0.1)',
    separator: 'rgb(0 0 0 / 0.08)',
    prominentBg: '#0071e3',
    prominentFg: '#ffffff',
    blur: '20px',
  };
}

export function toolbarTokensToCSSVariables(tokens: ToolbarTokens): Record<string, string> {
  return {
    '--lr-toolbar-height': tokens.height,
    '--lr-toolbar-height-large-title': tokens.heightLargeTitle,
    '--lr-toolbar-padding-x': tokens.paddingX,
    '--lr-toolbar-section-gap': tokens.sectionGap,
    '--lr-toolbar-item-size': tokens.itemSize,
    '--lr-toolbar-item-radius': tokens.itemRadius,
    '--lr-toolbar-item-gap': tokens.itemGap,
    '--lr-toolbar-fixed-space': tokens.fixedSpace,
    '--lr-toolbar-title-max-width': tokens.titleMaxWidth,
    '--lr-toolbar-title-font-size': tokens.titleFontSize,
    '--lr-toolbar-title-font-weight': tokens.titleFontWeight,
    '--lr-toolbar-large-title-font-size': tokens.largeTitleFontSize,
    '--lr-toolbar-search-min-width': tokens.searchMinWidth,
    '--lr-toolbar-search-height': tokens.searchHeight,
    '--lr-toolbar-bg': tokens.background,
    '--lr-toolbar-fg': tokens.foreground,
    '--lr-toolbar-item-hover': tokens.itemHover,
    '--lr-toolbar-item-active': tokens.itemActive,
    '--lr-toolbar-separator': tokens.separator,
    '--lr-toolbar-prominent-bg': tokens.prominentBg,
    '--lr-toolbar-prominent-fg': tokens.prominentFg,
    '--lr-toolbar-blur': tokens.blur,
  };
}

/** Recommended maximum toolbar title length per Apple HIG. */
export const MAX_TOOLBAR_TITLE_LENGTH = 15;

/** Recommended maximum number of toolbar item groups. */
export const MAX_TOOLBAR_GROUPS = 3;
