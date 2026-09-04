
export type BoxVariant = 'secondary' | 'tertiary';
export type BoxTitlePosition = 'inside' | 'above';

export interface CollectionItem {
  id: string;
  label?: string;
  imageUrl?: string;
  content?: any;
}

export type CollectionLayout = 'row' | 'grid';

export interface ColumnViewNode {
  id: string;
  label: string;
  children?: ColumnViewNode[];
  detail?: any;
  meta?: Record<string, string>;
}
