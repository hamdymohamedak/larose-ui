import type { ThemeMode } from '@larose-ui/core';

export interface DragDropTokens {
  previewOpacity: string;
  previewShadow: string;
  zoneActiveBorder: string;
  zoneActiveBg: string;
  zoneInvalidBorder: string;
  zoneInvalidBg: string;
  insertionColor: string;
  badgeBg: string;
  revertDuration: string;
}

/**
 * Apple HIG-inspired drag and drop tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/drag-and-drop
 */
export function getDragDropTokens(mode: ThemeMode): DragDropTokens {
  if (mode === 'dark') {
    return {
      previewOpacity: '0.72',
      previewShadow: '0 8px 24px rgb(0 0 0 / 0.45)',
      zoneActiveBorder: '#0a84ff',
      zoneActiveBg: 'rgb(10 132 255 / 0.14)',
      zoneInvalidBorder: '#ff453a',
      zoneInvalidBg: 'rgb(255 69 58 / 0.1)',
      insertionColor: '#0a84ff',
      badgeBg: '#0a84ff',
      revertDuration: '220ms',
    };
  }

  return {
    previewOpacity: '0.78',
    previewShadow: '0 8px 24px rgb(0 0 0 / 0.16)',
    zoneActiveBorder: '#0071e3',
    zoneActiveBg: 'rgb(0 113 227 / 0.08)',
    zoneInvalidBorder: '#ff3b30',
    zoneInvalidBg: 'rgb(255 59 48 / 0.08)',
    insertionColor: '#0071e3',
    badgeBg: '#0071e3',
    revertDuration: '220ms',
  };
}

export function dragDropTokensToCSSVariables(tokens: DragDropTokens): Record<string, string> {
  return {
    '--lr-dnd-preview-opacity': tokens.previewOpacity,
    '--lr-dnd-preview-shadow': tokens.previewShadow,
    '--lr-dnd-zone-active-border': tokens.zoneActiveBorder,
    '--lr-dnd-zone-active-bg': tokens.zoneActiveBg,
    '--lr-dnd-zone-invalid-border': tokens.zoneInvalidBorder,
    '--lr-dnd-zone-invalid-bg': tokens.zoneInvalidBg,
    '--lr-dnd-insertion-color': tokens.insertionColor,
    '--lr-dnd-badge-bg': tokens.badgeBg,
    '--lr-dnd-revert-duration': tokens.revertDuration,
  };
}

/** ~3 pt drag threshold per Apple HIG feedback guidance. */
export const DRAG_START_THRESHOLD_PX = 3;
