import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { VersionInfo } from '@larose/core';
import { Alert } from '@larose/react';
import { checkVersionCompatibility, type VersionCheckOptions } from './checkVersion';

const VersionContext = createContext<VersionInfo | null>(null);

export interface VersionProviderProps extends VersionCheckOptions {
  children: ReactNode;
  showBanner?: boolean;
}

export function VersionProvider({
  children,
  showBanner = true,
  ...options
}: VersionProviderProps) {
  const info = useMemo(
    () => checkVersionCompatibility(options),
    [
      options.frontend,
      options.backend,
      options.minBackend,
      options.maxBackend,
      options.deprecatedFeatures?.join(','),
      options.requiredFeatures?.join(','),
    ],
  );

  return (
    <VersionContext.Provider value={info}>
      {showBanner && !info.compatible && (
        <Alert variant="warning" title="Version mismatch">
          {info.warnings[0] ?? 'This feature requires an application update.'}
        </Alert>
      )}
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion(): VersionInfo {
  const ctx = useContext(VersionContext);
  if (!ctx) {
    throw new Error('useVersion must be used within VersionProvider');
  }
  return ctx;
}

export function useOptionalVersion(): VersionInfo | null {
  return useContext(VersionContext);
}
