import type { ThemeMode } from '@larose-ui/core';

export interface ColumnViewTokens {
  columnWidth: string;
  columnMinWidth: string;
  divider: string;
  rowHover: string;
  rowSelected: string;
  detailBg: string;
}

/** Apple HIG-inspired column view tokens. */
export function getColumnViewTokens(mode: ThemeMode): ColumnViewTokens {
  if (mode === 'dark') {
    return {
      columnWidth: '14rem',
      columnMinWidth: '10rem',
      divider: 'rgb(255 255 255 / 0.1)',
      rowHover: 'rgb(118 118 128 / 0.18)',
      rowSelected: 'rgb(10 132 255 / 0.22)',
      detailBg: '#1c1c1e',
    };
  }

  return {
    columnWidth: '14rem',
    columnMinWidth: '10rem',
    divider: 'rgb(0 0 0 / 0.08)',
    rowHover: 'rgb(118 118 128 / 0.08)',
    rowSelected: 'rgb(0 113 227 / 0.12)',
    detailBg: '#f5f5f7',
  };
}

export function columnViewTokensToCSSVariables(tokens: ColumnViewTokens): Record<string, string> {
  return {
    '--lr-column-view-width': tokens.columnWidth,
    '--lr-column-view-min-width': tokens.columnMinWidth,
    '--lr-column-view-divider': tokens.divider,
    '--lr-column-view-row-hover': tokens.rowHover,
    '--lr-column-view-row-selected': tokens.rowSelected,
    '--lr-column-view-detail-bg': tokens.detailBg,
  };
}
