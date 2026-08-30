import type { ThemeMode } from '@larose-ui/core';

export interface PickerTokens {
  rowHeight: string;
  wheelHeight: string;
  wheelWidth: string;
  selectionRadius: string;
  selectionBg: string;
  fadeHeight: string;
  compactMinWidth: string;
  calendarCellSize: string;
}

const pickerBase: PickerTokens = {
  rowHeight: '2.25rem',
  wheelHeight: '13.5rem',
  wheelWidth: '5.75rem',
  selectionRadius: '0.625rem',
  selectionBg: 'rgb(0 0 0 / 0.06)',
  fadeHeight: '3.25rem',
  compactMinWidth: '14rem',
  calendarCellSize: '2.25rem',
};

const pickerDark: Partial<PickerTokens> = {
  selectionBg: 'rgb(255 255 255 / 0.1)',
};

export function getPickerTokens(mode: ThemeMode = 'light'): PickerTokens {
  return mode === 'dark' ? { ...pickerBase, ...pickerDark } : pickerBase;
}

export function pickerTokensToCSSVariables(tokens: PickerTokens): Record<string, string> {
  return {
    '--lr-picker-row-height': tokens.rowHeight,
    '--lr-picker-wheel-height': tokens.wheelHeight,
    '--lr-picker-wheel-width': tokens.wheelWidth,
    '--lr-picker-selection-radius': tokens.selectionRadius,
    '--lr-picker-selection-bg': tokens.selectionBg,
    '--lr-picker-fade-height': tokens.fadeHeight,
    '--lr-picker-compact-min-width': tokens.compactMinWidth,
    '--lr-picker-calendar-cell-size': tokens.calendarCellSize,
  };
}
