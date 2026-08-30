import type { ThemeMode } from '@larose-ui/core';

export interface FileManagementTokens {
  browserSheetRadius: string;
  browserSheetShadow: string;
  previewRadius: string;
  previewBg: string;
  rowHover: string;
  rowSelected: string;
  syncSynced: string;
  syncSyncing: string;
  syncError: string;
  unsavedDot: string;
  launcherHeroMinHeight: string;
}

/**
 * Apple HIG-inspired file management tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/file-management
 */
export function getFileManagementTokens(mode: ThemeMode): FileManagementTokens {
  if (mode === 'dark') {
    return {
      browserSheetRadius: '0.875rem',
      browserSheetShadow: '0 12px 40px rgb(0 0 0 / 0.45)',
      previewRadius: '0.75rem',
      previewBg: '#1c1c1e',
      rowHover: 'rgb(118 118 128 / 0.18)',
      rowSelected: 'rgb(10 132 255 / 0.18)',
      syncSynced: '#30d158',
      syncSyncing: '#0a84ff',
      syncError: '#ff453a',
      unsavedDot: '#ff453a',
      launcherHeroMinHeight: '12rem',
    };
  }

  return {
    browserSheetRadius: '0.875rem',
    browserSheetShadow: '0 12px 40px rgb(0 0 0 / 0.14)',
    previewRadius: '0.75rem',
    previewBg: '#f5f5f7',
    rowHover: 'rgb(118 118 128 / 0.08)',
    rowSelected: 'rgb(0 113 227 / 0.1)',
    syncSynced: '#34c759',
    syncSyncing: '#0071e3',
    syncError: '#ff3b30',
    unsavedDot: '#ff3b30',
    launcherHeroMinHeight: '12rem',
  };
}

export function fileManagementTokensToCSSVariables(
  tokens: FileManagementTokens,
): Record<string, string> {
  return {
    '--lr-file-browser-sheet-radius': tokens.browserSheetRadius,
    '--lr-file-browser-sheet-shadow': tokens.browserSheetShadow,
    '--lr-file-preview-radius': tokens.previewRadius,
    '--lr-file-preview-bg': tokens.previewBg,
    '--lr-file-row-hover': tokens.rowHover,
    '--lr-file-row-selected': tokens.rowSelected,
    '--lr-file-sync-synced': tokens.syncSynced,
    '--lr-file-sync-syncing': tokens.syncSyncing,
    '--lr-file-sync-error': tokens.syncError,
    '--lr-file-unsaved-dot': tokens.unsavedDot,
    '--lr-file-launcher-hero-min-height': tokens.launcherHeroMinHeight,
  };
}
