import type { AIAdapter } from '@larose-ui/ai-core';
import type { Column } from '@larose-ui/runtime-svelte';

export interface SmartTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  adapter?: AIAdapter;
  filterPlaceholder?: string;
  readPermission?: string;
}
