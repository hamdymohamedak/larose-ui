import type { NetworkCondition } from '@larose-ui/core';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => string;
  priority?: 'high' | 'medium' | 'low';
}

export interface AdaptiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  networkCondition?: NetworkCondition;
}
