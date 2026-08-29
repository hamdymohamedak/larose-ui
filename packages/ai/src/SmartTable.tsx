import { useMemo, useState } from 'react';
import { AdaptiveTable, type AdaptiveTableProps } from '@larose/runtime';
import { Input, Button } from '@larose/react';
import type { AIAdapter } from './adapter';
import { createMockAdapter } from './adapters/mockAdapter';
import styles from './SmartTable.module.css';
import { useSmartAIRuntime } from './useSmartAIRuntime';

export interface SmartTableProps<T> extends AdaptiveTableProps<T> {
  adapter?: AIAdapter;
  filterPlaceholder?: string;
  /** Permission required for AI filter actions */
  readPermission?: string;
}

export function SmartTable<T>({
  adapter = createMockAdapter(),
  filterPlaceholder = 'Ask in natural language… e.g. "Show employees late more than 3 times"',
  readPermission = 'employees.read',
  data,
  columns,
  ...tableProps
}: SmartTableProps<T>) {
  const runtime = useSmartAIRuntime(adapter);
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [denial, setDenial] = useState<string | null>(null);
  const [filtered, setFiltered] = useState(data);

  const columnMeta = useMemo(
    () => columns.map((c) => ({ key: c.key, header: c.header })),
    [columns],
  );

  const applyQuery = async () => {
    setDenial(null);
    const execution = await runtime.filterTable(
      query,
      data as Array<Record<string, unknown>>,
      columnMeta,
      readPermission,
    );

    if (!execution.allowed || !execution.result) {
      setDenial(execution.denialReason ?? 'Action not permitted');
      setExplanation(null);
      return;
    }

    setFiltered(execution.result.data as T[]);
    setExplanation(execution.result.explanation);
  };

  return (
    <div className={styles.wrapper} data-lr-smart-table data-lr-component="SmartTable">
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
      {denial && (
        <p className={styles.denial} data-lr-ai-denied role="alert">
          {denial}
        </p>
      )}
      {explanation && !denial && <p className={styles.explanation}>{explanation}</p>}
      <AdaptiveTable data={filtered} columns={columns} {...tableProps} />
    </div>
  );
}
