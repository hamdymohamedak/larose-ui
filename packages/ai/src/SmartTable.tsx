import { useMemo, useState } from 'react';
import { AdaptiveTable, type AdaptiveTableProps } from '@larose/runtime';
import { Input, Button } from '@larose/react';
import type { AIAdapter } from './adapter';
import { createMockAdapter } from './adapters/mockAdapter';
import styles from './SmartTable.module.css';

export interface SmartTableProps<T> extends AdaptiveTableProps<T> {
  adapter?: AIAdapter;
  filterPlaceholder?: string;
}

export function SmartTable<T>({
  adapter = createMockAdapter(),
  filterPlaceholder = 'Ask in natural language… e.g. "Show employees late more than 3 times"',
  data,
  columns,
  ...tableProps
}: SmartTableProps<T>) {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [filtered, setFiltered] = useState(data);

  const columnMeta = useMemo(
    () => columns.map((c) => ({ key: c.key, header: c.header })),
    [columns],
  );

  const applyQuery = async () => {
    const result = await adapter.filterTable(
      query,
      data as Array<Record<string, unknown>>,
      columnMeta,
    );
    setFiltered(result.data as T[]);
    setExplanation(result.explanation);
  };

  return (
    <div className={styles.wrapper} data-lr-smart-table>
      <div className={styles.promptRow}>
        <Input
          label="Smart filter"
          placeholder={filterPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void applyQuery();
          }}
        />
        <Button onClick={() => void applyQuery()}>Apply</Button>
      </div>
      {explanation && <p className={styles.explanation}>{explanation}</p>}
      <AdaptiveTable data={filtered} columns={columns} {...tableProps} />
    </div>
  );
}
