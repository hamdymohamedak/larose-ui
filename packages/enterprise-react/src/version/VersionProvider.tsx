import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { VersionInfo } from '@larose-ui/core';
import { Alert } from '@larose-ui/react';
import { checkVersionCompatibility, type VersionCheckOptions } from '@larose-ui/enterprise-core';

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
