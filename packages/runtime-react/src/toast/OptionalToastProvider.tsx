import { lazy, Suspense, type ReactNode } from 'react';

export interface OptionalToastProviderProps {
  children: ReactNode;
  enabled?: boolean;
  placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const LazyToastProvider = lazy(async () => {
  const mod = await import('@larose-ui/react');
  return { default: mod.ToastProvider };
});

/**
 * Opt-in toast wrapper — keeps @larose-ui/react out of the default runtime bundle.
 * Used internally by LaRoseProvider when enableToasts is true.
 */
export function OptionalToastProvider({
  children,
  enabled = true,
  placement = 'bottom-right',
}: OptionalToastProviderProps) {
  if (!enabled) return <>{children}</>;

  return (
    <Suspense fallback={children}>
      <LazyToastProvider placement={placement}>{children}</LazyToastProvider>
    </Suspense>
  );
}
