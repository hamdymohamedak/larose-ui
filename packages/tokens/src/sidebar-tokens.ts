import type { ThemeMode } from '@larose-ui/core';

export interface SidebarTokens {
  width: string;
  widthCompact: string;
  height: string;
  maxHeight: string;
  overflow: string;
  navOverflowY: string;
  itemHeight: string;
  itemRadius: string;
  sectionGap: string;
  background: string;
  foreground: string;
  itemHover: string;
  itemActive: string;
  groupLabelSize: string;
  disclosureChevronSize: string;
}

/** @see https://developer.apple.com/design/human-interface-guidelines/sidebars */
export function getSidebarTokens(mode: ThemeMode): SidebarTokens {
  if (mode === 'dark') {
    return {
      width: '16rem',
      widthCompact: '13rem',
      height: '100dvh',
      maxHeight: '100dvh',
      overflow: 'hidden',
      navOverflowY: 'auto',
      itemHeight: '1.75rem',
      itemRadius: '0.4375rem',
      sectionGap: '0.5rem',
      background: 'rgb(30 30 30 / 0.72)',
      foreground: '#f5f5f7',
      itemHover: 'rgb(255 255 255 / 0.08)',
      itemActive: 'rgb(10 132 255 / 0.22)',
      groupLabelSize: '0.6875rem',
      disclosureChevronSize: '0.625rem',
    };
  }
  return {
    width: '16rem',
    widthCompact: '13rem',
    height: '100dvh',
    maxHeight: '100dvh',
    overflow: 'hidden',
    navOverflowY: 'auto',
    itemHeight: '1.75rem',
    itemRadius: '0.4375rem',
    sectionGap: '0.5rem',
    background: 'rgb(255 255 255 / 0.72)',
    foreground: '#1d1d1f',
    itemHover: 'rgb(0 0 0 / 0.06)',
    itemActive: 'rgb(0 113 227 / 0.12)',
    groupLabelSize: '0.6875rem',
    disclosureChevronSize: '0.625rem',
  };
}

export function sidebarTokensToCSSVariables(tokens: SidebarTokens): Record<string, string> {
  return {
    '--lr-sidebar-width': tokens.width,
    '--lr-sidebar-width-compact': tokens.widthCompact,
    '--lr-sidebar-height': tokens.height,
    '--lr-sidebar-max-height': tokens.maxHeight,
    '--lr-sidebar-overflow': tokens.overflow,
    '--lr-sidebar-nav-overflow-y': tokens.navOverflowY,
    '--lr-sidebar-item-height': tokens.itemHeight,
    '--lr-sidebar-item-radius': tokens.itemRadius,
    '--lr-sidebar-section-gap': tokens.sectionGap,
    '--lr-sidebar-bg': tokens.background,
    '--lr-sidebar-fg': tokens.foreground,
    '--lr-sidebar-item-hover': tokens.itemHover,
    '--lr-sidebar-item-active': tokens.itemActive,
    '--lr-sidebar-group-label-size': tokens.groupLabelSize,
    '--lr-sidebar-disclosure-chevron-size': tokens.disclosureChevronSize,
  };
}

export type SidebarSize = 'small' | 'medium' | 'large';
