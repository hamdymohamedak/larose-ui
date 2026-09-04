import { useEffect, useState, type ReactNode } from 'react';
import type { ApiError } from '@larose-ui/core';
import { getRetryDelay } from './client';
import { useQuery, type UseQueryOptions } from './useQuery';

export interface SelfHealingErrorProps {
  error: ApiError;
  onRetry?: () => void;
  retryCount?: number;
}

export function SelfHealingError({
  error,
  onRetry,
  retryCount = 0,
}: SelfHealingErrorProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (error.code === 429 && error.retryable && onRetry) {
      const delay = Math.ceil(getRetryDelay(retryCount, 2000) / 1000);
      setCountdown(delay);
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c === null || c <= 1) {
            clearInterval(timer);
            onRetry();
            return null;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [error, onRetry, retryCount]);

  return (
    <div role="alert" data-lr-error={error.code} style={{ textAlign: 'center', padding: 'var(--lr-space-4)' }}>
      <p style={{ color: 'var(--lr-color-error)', marginBottom: 'var(--lr-space-2)' }}>
        {error.message}
      </p>
      {error.retryable && onRetry && error.code !== 429 && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: 'var(--lr-space-2) var(--lr-space-4)',
            borderRadius: 'var(--lr-radius-md)',
            border: '1px solid var(--lr-color-border)',
            background: 'var(--lr-color-surface)',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
      {countdown !== null && (
        <p style={{ fontSize: 'var(--lr-font-size-sm)', color: 'var(--lr-color-text-muted)' }}>
          Retrying in {countdown}s...
        </p>
      )}
    </div>
  );
}

export interface DataViewProps<T> extends UseQueryOptions<T> {
  url: string;
  children: (data: T) => ReactNode;
  empty?: ReactNode;
  loading?: ReactNode;
  unauthorized?: ReactNode;
}

export function DataView<T>({
  url,
  children,
  empty,
  loading,
  unauthorized,
  ...queryOptions
}: DataViewProps<T>) {
  const query = useQuery<T>(url, queryOptions);

  if (query.status === 'loading' || query.status === 'idle') {
    return (
      loading ?? (
        <div role="status" aria-busy="true" style={{ padding: 'var(--lr-space-4)' }}>
          Loading...
        </div>
      )
    );
  }

  if (query.status === 'unauthorized') {
    return (
      unauthorized ?? (
        <div role="alert" style={{ padding: 'var(--lr-space-4)', color: 'var(--lr-color-error)' }}>
          You do not have permission to view this data.
        </div>
      )
    );
  }

  if (query.status === 'error' && query.error) {
    return (
      <SelfHealingError
        error={query.error}
        onRetry={() => void query.retry()}
        retryCount={query.retryCount}
      />
    );
  }

  if (query.isEmpty) {
    return (
      empty ?? (
        <div role="status" style={{ padding: 'var(--lr-space-4)', color: 'var(--lr-color-text-muted)' }}>
          No data found
        </div>
      )
    );
  }

  if (query.data !== null) {
    return <>{children(query.data)}</>;
  }

  return null;
}

export interface ResourceProps<T> extends UseQueryOptions<T> {
  url: string;
  children: (resource: { data: T; refetch: () => Promise<void> }) => ReactNode;
}

export function Resource<T>({ url, children, ...options }: ResourceProps<T>) {
  const query = useQuery<T>(url, options);

  if (query.status !== 'success' || query.data === null) {
    return (
      <DataView url={url} {...options}>
        {(data) => children({ data, refetch: query.refetch })}
      </DataView>
    );
  }

  return <>{children({ data: query.data, refetch: query.refetch })}</>;
}
