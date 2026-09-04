import type { AIAdapter, FormFillResult, TableFilterResult } from '../adapter';

export interface HttpAdapterOptions {
  baseUrl?: string;
  tableEndpoint?: string;
  formEndpoint?: string;
  headers?: Record<string, string>;
  fallback?: AIAdapter;
}

export function createHttpAdapter(options: HttpAdapterOptions = {}): AIAdapter {
  const baseUrl = options.baseUrl ?? '';
  const tableEndpoint = options.tableEndpoint ?? '/api/ai/table-filter';
  const formEndpoint = options.formEndpoint ?? '/api/ai/form-populate';
  const fallback = options.fallback;

  async function post<T>(endpoint: string, body: unknown): Promise<T | null> {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch {
      return null;
    }
  }

  return {
    async filterTable(query, data, columns) {
      const remote = await post<TableFilterResult<Record<string, unknown>>>(tableEndpoint, {
        query,
        columns,
        sample: data.slice(0, 5),
      });
      if (remote) return remote as TableFilterResult<typeof data[number]>;
      if (fallback) return fallback.filterTable(query, data, columns);
      return { data, explanation: 'AI service unavailable — showing all records' };
    },

    async populateForm(query, fields) {
      const remote = await post<FormFillResult>(formEndpoint, { query, fields });
      if (remote) return remote;
      if (fallback) return fallback.populateForm(query, fields);
      return {
        values: {},
        explanation: 'AI service unavailable — enter fields manually',
      };
    },
  };
}

export function createFallbackAdapter(primary: AIAdapter, secondary: AIAdapter): AIAdapter {
  return {
    async filterTable(query, data, columns) {
      try {
        return await primary.filterTable(query, data, columns);
      } catch {
        return secondary.filterTable(query, data, columns);
      }
    },
    async populateForm(query, fields) {
      try {
        return await primary.populateForm(query, fields);
      } catch {
        return secondary.populateForm(query, fields);
      }
    },
  };
}
