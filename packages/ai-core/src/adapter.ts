export interface TableFilterResult<T> {
  data: T[];
  explanation: string;
}

export interface FormFillResult {
  values: Record<string, string>;
  explanation: string;
}

export interface AIAdapter {
  filterTable<T extends Record<string, unknown>>(
    query: string,
    data: T[],
    columns: Array<{ key: string; header: string }>,
  ): Promise<TableFilterResult<T>>;

  populateForm(
    query: string,
    fields: Array<{ name: string; label: string }>,
  ): Promise<FormFillResult>;
}

export interface AIAdapterContext {
  locale?: string;
  tenantId?: string;
}
