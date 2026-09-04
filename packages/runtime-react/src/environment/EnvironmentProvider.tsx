import { createContext, useContext, type ReactNode } from 'react';
import type { Environment } from '@larose-ui/core';

const EnvironmentContext = createContext<Environment>('development');

export function useEnvironment(): Environment {
  return useContext(EnvironmentContext);
}

export interface EnvironmentProviderProps {
  environment?: Environment;
  children: ReactNode;
}

const envLabels: Partial<Record<Environment, string>> = {
  staging: 'STAGING',
  demo: 'DEMO MODE',
  readonly: 'READ ONLY',
  maintenance: 'MAINTENANCE',
};

export function EnvironmentProvider({
  environment = 'development',
  children,
}: EnvironmentProviderProps) {
  const showBanner = environment !== 'development' && environment !== 'production';
  const label = envLabels[environment];

  return (
    <EnvironmentContext.Provider value={environment}>
      {showBanner && label && (
        <div
          data-lr-env-banner
          style={{
            background: 'var(--lr-color-warning, #ca8a04)',
            color: 'var(--lr-color-text-inverse, #fff)',
            textAlign: 'center',
            padding: 'var(--lr-space-1, 0.25rem)',
            fontSize: 'var(--lr-font-size-xs, 0.75rem)',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      )}
      {children}
    </EnvironmentContext.Provider>
  );
}
