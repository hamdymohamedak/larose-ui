export type ListVariant = 'plain' | 'grouped';

export type ListAccessory = 'none' | 'disclosure' | 'info' | 'checkmark';

export type TableSelectionMode = 'none' | 'navigation' | 'options';

export type SortDirection = 'asc' | 'desc';

export interface OutlineNode {
  id: string;
  label: string;
  values?: Record<string, string>;
  children?: OutlineNode[];
}

export interface OutlineColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: number;
}
