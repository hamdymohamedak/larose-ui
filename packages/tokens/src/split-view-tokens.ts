import type { ThemeMode } from '@larose-ui/core';

export interface SplitViewTokens {
  dividerWidth: string;
  dividerHitArea: string;
  paneMinSize: string;
  sidebarRatio: string;
  detailRatio: string;
  dividerColor: string;
  paneBg: string;
}

/**
 * Apple HIG-inspired split view tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/split-views
 */
export function getSplitViewTokens(mode: ThemeMode): SplitViewTokens {
  if (mode === 'dark') {
    return {
      dividerWidth: '1px',
      dividerHitArea: '0.375rem',
      paneMinSize: '7.5rem',
      sidebarRatio: '0.25',
      detailRatio: '0.75',
      dividerColor: 'rgb(255 255 255 / 0.12)',
      paneBg: '#1c1c1e',
    };
  }

  return {
    dividerWidth: '1px',
    dividerHitArea: '0.375rem',
    paneMinSize: '7.5rem',
    sidebarRatio: '0.25',
    detailRatio: '0.75',
    dividerColor: 'rgb(0 0 0 / 0.1)',
    paneBg: '#ffffff',
  };
}

export function splitViewTokensToCSSVariables(tokens: SplitViewTokens): Record<string, string> {
  return {
    '--lr-split-divider-width': tokens.dividerWidth,
    '--lr-split-divider-hit-area': tokens.dividerHitArea,
    '--lr-split-pane-min-size': tokens.paneMinSize,
    '--lr-split-sidebar-ratio': tokens.sidebarRatio,
    '--lr-split-detail-ratio': tokens.detailRatio,
    '--lr-split-divider-color': tokens.dividerColor,
    '--lr-split-pane-bg': tokens.paneBg,
  };
}
