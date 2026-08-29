import { useEffect, type ReactNode } from 'react';
import type {
  Density,
  Environment,
  FeatureFlagEvaluator,
  SessionState,
  ThemeMode,
  UserContext,
  TenantContext,
} from '@larose-ui/core';
import { LAROSE_VERSION } from '@larose-ui/core';
import type { ColorTokens } from '@larose-ui/tokens';
import { PermissionProvider } from '@larose-ui/permissions';
import {
  ObservabilityProvider,
  createConsoleAdapter,
  createNoopAdapter,
  type ObservabilityAdapter,
} from '@larose-ui/observability';
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
import { RuntimeContextProvider } from './runtime/RuntimeContextProvider';
import { RuntimeBridge, SessionBridge } from './runtime/RuntimeBridge';
import { RuntimeObservabilityBridge } from './observability/RuntimeObservabilityBridge';
import type { RuntimeEvent } from './runtime/RuntimeContextProvider';
import { resolveTenantConfig } from './tenant/resolveTenant';
import { OptionalToastProvider } from './toast/OptionalToastProvider';

export interface LaRoseProviderProps {
  children: ReactNode;
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  tenant?: TenantContext;
  brandColors?: Partial<ColorTokens>;
  locale?: Locale;
  timezone?: string;
  environment?: Environment;
  permissions?: string[];
  permissionsLoading?: boolean;
  features?: Record<string, FeatureState>;
  featuresLoading?: boolean;
  featureFlagEvaluator?: FeatureFlagEvaluator;
  featureNames?: string[];
  observabilityAdapter?: ObservabilityAdapter;
  observabilityDebug?: boolean;
  userId?: string;
  user?: UserContext;
  session?: SessionState;
  version?: {
    frontend?: string;
    api?: string;
    feature?: string;
    compatible?: boolean;
    warnings?: string[];
  };
  onRuntimeEvent?: (event: RuntimeEvent) => void;
  enableToasts?: boolean;
  toastPlacement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
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
  tenant,
  brandColors,
  locale = 'en',
  timezone,
  environment = 'development',
  permissions = [],
  permissionsLoading = false,
  features = {},
  featuresLoading = false,
  featureFlagEvaluator,
  featureNames,
  observabilityAdapter,
  observabilityDebug,
  userId,
  user,
  session,
  version,
  onRuntimeEvent,
  enableToasts = true,
  toastPlacement = 'bottom-right',
}: LaRoseProviderProps) {
  const adapter =
    observabilityAdapter ??
    (observabilityDebug ? createConsoleAdapter() : createNoopAdapter());

  const resolved = resolveTenantConfig({
    tenant,
    tenantId,
    theme,
    density,
    brandColors,
    locale,
    timezone,
    permissions,
    features,
  });

  const resolvedTenantId = resolved.tenantId;
  const resolvedVersion = {
    frontend: version?.frontend ?? LAROSE_VERSION,
    api: version?.api,
    feature: version?.feature,
    compatible: version?.compatible ?? true,
    warnings: version?.warnings ?? [],
  };

  const tree = (
    <RuntimeContextProvider
      initialContext={{
        environment,
        session: session ?? (user || userId ? 'authenticated' : 'unauthenticated'),
        timezone: resolved.timezone,
        version: resolvedVersion,
      }}
      onEvent={onRuntimeEvent}
    >
      <ThemeProvider
        theme={resolved.theme}
        density={resolved.density}
        tenantId={resolvedTenantId}
        brandColors={resolved.brandColors}
      >
        <ObservabilityProvider
          adapter={adapter}
          tenantId={resolvedTenantId}
          userId={userId ?? user?.id}
          debug={observabilityDebug}
        >
          <I18nProvider locale={resolved.locale}>
            <PermissionProvider
              permissions={resolved.permissions}
              loading={permissionsLoading}
              context={{ userId: userId ?? user?.id, tenantId: resolvedTenantId }}
            >
              <FeatureFlagProvider features={resolved.features} loading={featuresLoading}>
                <EnvironmentProvider environment={environment}>
                  <ResponsiveProvider>
                    <NetworkProvider>
                      <OfflineProvider>
                        <AutoSync>
                          <RuntimeBridge
                            userId={userId}
                            user={user}
                            tenant={resolved.tenant ?? tenant}
                            tenantId={tenantId}
                            timezone={resolved.timezone}
                            session={session}
                            features={resolved.features}
                            featuresLoading={featuresLoading}
                            version={resolvedVersion}
                            featureFlagEvaluator={featureFlagEvaluator}
                            featureNames={
                              featureNames ?? Object.keys(resolved.features)
                            }
                          />
                          <RuntimeObservabilityBridge />
                          <SessionBridge />
                          {children}
                        </AutoSync>
                      </OfflineProvider>
                    </NetworkProvider>
                  </ResponsiveProvider>
                </EnvironmentProvider>
              </FeatureFlagProvider>
            </PermissionProvider>
          </I18nProvider>
        </ObservabilityProvider>
      </ThemeProvider>
    </RuntimeContextProvider>
  );

  if (!enableToasts) return tree;

  return (
    <OptionalToastProvider enabled placement={toastPlacement}>
      {tree}
    </OptionalToastProvider>
  );
}
