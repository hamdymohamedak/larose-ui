import type { ThemeMode } from '@larose-ui/core';

export interface ListTableTokens {
  listRadius: string;
  groupedBg: string;
  sectionHeaderSize: string;
  rowMinHeight: string;
  rowPadding: string;
  rowSelected: string;
  rowHover: string;
  tableHeadBg: string;
  tableRowAlt: string;
  sortIndicator: string;
}

/** Apple HIG-inspired list & table tokens. */
export function getListTableTokens(mode: ThemeMode): ListTableTokens {
  if (mode === 'dark') {
    return {
      listRadius: '0.625rem',
      groupedBg: '#2c2c2e',
      sectionHeaderSize: '0.8125rem',
      rowMinHeight: '2.75rem',
      rowPadding: '0.75rem 1rem',
      rowSelected: 'rgb(10 132 255 / 0.22)',
      rowHover: 'rgb(118 118 128 / 0.18)',
      tableHeadBg: '#3a3a3c',
      tableRowAlt: 'rgb(118 118 128 / 0.12)',
      sortIndicator: '#0a84ff',
    };
  }

  return {
    listRadius: '0.625rem',
    groupedBg: '#ffffff',
    sectionHeaderSize: '0.8125rem',
    rowMinHeight: '2.75rem',
    rowPadding: '0.75rem 1rem',
    rowSelected: 'rgb(0 113 227 / 0.12)',
    rowHover: 'rgb(118 118 128 / 0.08)',
    tableHeadBg: '#f5f5f7',
    tableRowAlt: 'rgb(118 118 128 / 0.06)',
    sortIndicator: '#0071e3',
  };
}

export function listTableTokensToCSSVariables(tokens: ListTableTokens): Record<string, string> {
  return {
    '--lr-list-radius': tokens.listRadius,
    '--lr-list-grouped-bg': tokens.groupedBg,
    '--lr-list-section-header-size': tokens.sectionHeaderSize,
    '--lr-list-row-min-height': tokens.rowMinHeight,
    '--lr-list-row-padding': tokens.rowPadding,
    '--lr-list-row-selected': tokens.rowSelected,
    '--lr-list-row-hover': tokens.rowHover,
    '--lr-table-head-bg': tokens.tableHeadBg,
    '--lr-table-row-alt': tokens.tableRowAlt,
    '--lr-table-sort-indicator': tokens.sortIndicator,
  };
}
