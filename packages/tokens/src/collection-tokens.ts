import type { ThemeMode } from '@larose-ui/core';

export interface CollectionTokens {
  gap: string;
  itemRadius: string;
  itemPadding: string;
  itemHover: string;
  itemSelected: string;
  minItemSize: string;
}

/** Apple HIG-inspired collection tokens. */
export function getCollectionTokens(mode: ThemeMode): CollectionTokens {
  if (mode === 'dark') {
    return {
      gap: '0.75rem',
      itemRadius: '0.625rem',
      itemPadding: '0.5rem',
      itemHover: 'rgb(118 118 128 / 0.18)',
      itemSelected: 'rgb(10 132 255 / 0.22)',
      minItemSize: '5.5rem',
    };
  }

  return {
    gap: '0.75rem',
    itemRadius: '0.625rem',
    itemPadding: '0.5rem',
    itemHover: 'rgb(118 118 128 / 0.08)',
    itemSelected: 'rgb(0 113 227 / 0.12)',
    minItemSize: '5.5rem',
  };
}

export function collectionTokensToCSSVariables(tokens: CollectionTokens): Record<string, string> {
  return {
    '--lr-collection-gap': tokens.gap,
    '--lr-collection-item-radius': tokens.itemRadius,
    '--lr-collection-item-padding': tokens.itemPadding,
    '--lr-collection-item-hover': tokens.itemHover,
    '--lr-collection-item-selected': tokens.itemSelected,
    '--lr-collection-min-item-size': tokens.minItemSize,
  };
}
