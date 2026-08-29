import { useEffect, type ReactNode } from 'react';
import type { Density, Environment, ThemeMode } from '@larose/core';
import { ToastProvider, type ToastProviderProps } from '@larose/react';
import type { ColorTokens } from '@larose/tokens';
import { PermissionProvider } from '@larose/permissions';
import {
  ObservabilityProvider,
  createConsoleAdapter,
  createNoopAdapter,
  type ObservabilityAdapter,
} from '@larose/observability';
import type { Locale } from './i18n/messages';
import { EnvironmentProvider } from './environment/EnvironmentProvider';
import { FeatureFlagProvider, type FeatureState } from './features/FeatureFlagProvider';
import { I18nProvider } from './i18n/I18nProvider';
import { NetworkProvider } from './network/NetworkProvider';
import { OfflineProvider } from './offline/OfflineProvider';
import { ResponsiveProvider } from './responsive/ResponsiveProvider';
import { ThemeProvider } from './theme/ThemeProvider';
import { useNetwork } from './network/NetworkProvider';
import { useOffline } from './offline/OfflineProvider';

export interface LaRoseProviderProps {
  children: ReactNode;
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  locale?: Locale;
  environment?: Environment;
  permissions?: string[];
  permissionsLoading?: boolean;
  features?: Record<string, FeatureState>;
  featuresLoading?: boolean;
  observabilityAdapter?: ObservabilityAdapter;
  observabilityDebug?: boolean;
  userId?: string;
  enableToasts?: boolean;
  toastPlacement?: ToastProviderProps['placement'];
}

function AutoSync({ children }: { children: ReactNode }) {
  const network = useNetwork();
  const offline = useOffline();

  useEffect(() => {
    if (network.online && offline.queue.length > 0) {
      void offline.sync(async (request) => {
        const response = await fetch(request.url, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            ...request.headers,
          },
          body: request.body ? JSON.stringify(request.body) : undefined,
        });
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      });
    }
  }, [network.online, offline.queue.length, offline]);

  return <>{children}</>;
}

export function LaRoseProvider({
  children,
  theme = 'light',
  density = 'comfortable',
  tenantId,
  brandColors,
  locale = 'en',
  environment = 'development',
  permissions = [],
  permissionsLoading = false,
  features = {},
  featuresLoading = false,
  observabilityAdapter,
  observabilityDebug,
  userId,
  enableToasts = true,
  toastPlacement = 'bottom-right',
}: LaRoseProviderProps) {
  const adapter =
    observabilityAdapter ??
    (observabilityDebug ? createConsoleAdapter() : createNoopAdapter());

  const tree = (
    <ThemeProvider
      theme={theme}
      density={density}
      tenantId={tenantId}
      brandColors={brandColors}
    >
      <ObservabilityProvider
        adapter={adapter}
        tenantId={tenantId}
        userId={userId}
        debug={observabilityDebug}
      >
        <I18nProvider locale={locale}>
          <PermissionProvider permissions={permissions} loading={permissionsLoading}>
            <FeatureFlagProvider features={features} loading={featuresLoading}>
              <EnvironmentProvider environment={environment}>
                <ResponsiveProvider>
                  <NetworkProvider>
                    <OfflineProvider>
                      <AutoSync>{children}</AutoSync>
                    </OfflineProvider>
                  </NetworkProvider>
                </ResponsiveProvider>
              </EnvironmentProvider>
            </FeatureFlagProvider>
          </PermissionProvider>
        </I18nProvider>
      </ObservabilityProvider>
    </ThemeProvider>
  );

  if (!enableToasts) return tree;

  return <ToastProvider placement={toastPlacement}>{tree}</ToastProvider>;
}
