import type { ReactNode } from 'react';
import { useBreakpoint } from './ResponsiveProvider';
import { useI18n } from '../i18n/I18nProvider';
import { useNetwork } from '../network/NetworkProvider';
import { shouldUseSkeleton } from '@larose-ui/network';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

export interface AdaptiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
}

export function AdaptiveTable<T>({
  data,
  columns,
  keyExtractor,
  loading,
  emptyMessage,
}: AdaptiveTableProps<T>) {
  const { breakpoint, isMobile } = useBreakpoint();
  const { t } = useI18n();
  const network = useNetwork();
  const showSkeleton = loading || shouldUseSkeleton(network.condition);

  if (showSkeleton) {
    return (
      <div data-lr-adaptive-table="skeleton" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 48,
              background: 'var(--lr-color-surface)',
              borderRadius: 'var(--lr-radius-md)',
              marginBottom: 'var(--lr-space-2)',
            }}
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div data-lr-adaptive-table="empty" role="status">
        {emptyMessage ?? t('common.empty')}
      </div>
    );
  }

  if (isMobile || breakpoint === 'mobile') {
    const visibleColumns = columns.filter((c) => c.priority !== 'low');
    return (
      <div data-lr-adaptive-table="cards">
        {data.map((row) => (
          <article
            key={keyExtractor(row)}
            style={{
              padding: 'var(--lr-space-4)',
              border: '1px solid var(--lr-color-border)',
              borderRadius: 'var(--lr-radius-md)',
              marginBottom: 'var(--lr-space-3)',
              background: 'var(--lr-color-surface-elevated)',
            }}
          >
            {visibleColumns.map((col) => (
              <div
                key={col.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--lr-space-2)',
                }}
              >
                <span style={{ color: 'var(--lr-color-text-muted)', fontSize: 'var(--lr-font-size-sm)' }}>
                  {col.header}
                </span>
                <span>{col.render(row)}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    );
  }

  return (
    <table data-lr-adaptive-table="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                textAlign: 'start',
                padding: 'var(--lr-space-3)',
                borderBottom: '2px solid var(--lr-color-border)',
                fontWeight: 'var(--lr-font-weight-semibold)',
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={keyExtractor(row)}>
            {columns.map((col) => (
              <td
                key={col.key}
                style={{
                  padding: 'var(--lr-space-3)',
                  borderBottom: '1px solid var(--lr-color-border)',
                }}
              >
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
