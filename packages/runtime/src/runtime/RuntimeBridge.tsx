import { useEffect, useMemo, useRef } from 'react';
import { usePermissions } from '@larose/permissions';
import type { Environment, FeatureFlagEvaluator, SessionState } from '@larose/core';
import { useEnvironment } from '../environment/EnvironmentProvider';
import { useI18n } from '../i18n/I18nProvider';
import { useNetwork } from '../network/NetworkProvider';
import { useOffline } from '../offline/OfflineProvider';
import { useTheme } from '../theme/ThemeProvider';
import type { FeatureState } from '../features/FeatureFlagProvider';
import { useRuntimeStore } from './RuntimeContextProvider';

export interface RuntimeBridgeProps {
  userId?: string;
  user?: { id: string; name?: string; email?: string; roles?: string[] };
  tenant?: { id: string; name?: string; locale?: string; timezone?: string };
  tenantId?: string;
  timezone?: string;
  session?: SessionState;
  features?: Record<string, FeatureState>;
  featuresLoading?: boolean;
  version?: {
    frontend: string;
    api?: string;
    feature?: string;
    compatible?: boolean;
    warnings?: string[];
  };
  featureFlagEvaluator?: FeatureFlagEvaluator;
  featureNames?: string[];
}

/**
 * Synchronizes domain providers into the unified runtime context store.
 * Mount inside LaRoseProvider after all domain providers.
 */
export function RuntimeBridge({
  userId,
  user,
  tenant,
  tenantId,
  timezone,
  session,
  features = {},
  featuresLoading = false,
  version,
  featureFlagEvaluator,
  featureNames = [],
}: RuntimeBridgeProps) {
  const { setContext, setSession, eventBus } = useRuntimeStore();
  const theme = useTheme();
  const { locale, dir } = useI18n();
  const environment = useEnvironment();
  const network = useNetwork();
  const offline = useOffline();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const lastPatchRef = useRef('');
  const lastNetworkRef = useRef(network.condition);

  const resolvedTenantId = tenant?.id ?? tenantId ?? theme.tenantId;
  const resolvedTimezone =
    timezone ?? tenant?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const featureSnapshot = useMemo(
    () =>
      buildFeatureSnapshot(
        features,
        featuresLoading,
        featureFlagEvaluator,
        featureNames,
        userId ?? user?.id,
        resolvedTenantId,
        environment,
      ),
    [
      features,
      featuresLoading,
      featureFlagEvaluator,
      featureNames,
      userId,
      user?.id,
      resolvedTenantId,
      environment,
    ],
  );

  useEffect(() => {
    if (session) setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    if (lastNetworkRef.current !== network.condition) {
      eventBus.emit({
        type: 'network.transition',
        metadata: { from: lastNetworkRef.current, to: network.condition, rtt: network.rtt },
      });
      lastNetworkRef.current = network.condition;
    }
  }, [network.condition, network.rtt, eventBus]);

  useEffect(() => {
    const resolvedUser = user ?? (userId ? { id: userId } : null);
    const resolvedTenant = resolvedTenantId
      ? {
          id: resolvedTenantId,
          name: tenant?.name,
          locale: tenant?.locale,
          timezone: tenant?.timezone,
        }
      : null;

    const patch = {
      environment,
      tenant: resolvedTenant,
      user: resolvedUser,
      permissions: { granted: permissions, loading: permissionsLoading },
      features: featureSnapshot,
      network: {
        condition: network.condition,
        online: network.online,
        effectiveType: network.effectiveType,
        rtt: network.rtt,
      },
      offline: { status: offline.status, queueLength: offline.queue.length },
      locale: { locale, dir },
      timezone: resolvedTimezone,
      theme: {
        mode: theme.theme,
        density: theme.density,
        tenantId: resolvedTenantId,
      },
      ...(version
        ? {
            version: {
              frontend: version.frontend,
              api: version.api,
              feature: version.feature,
              compatible: version.compatible ?? true,
              warnings: version.warnings ?? [],
            },
          }
        : {}),
    };

    const serialized = JSON.stringify(patch);
    if (lastPatchRef.current === serialized) return;
    lastPatchRef.current = serialized;
    setContext(patch);
  }, [
    environment,
    locale,
    dir,
    network.condition,
    network.online,
    network.effectiveType,
    network.rtt,
    offline.status,
    offline.queue.length,
    permissions,
    permissionsLoading,
    theme.theme,
    theme.density,
    userId,
    user,
    tenant,
    resolvedTenantId,
    resolvedTimezone,
    version,
    featureSnapshot,
    setContext,
  ]);

  return null;
}

function buildFeatureSnapshot(
  features: Record<string, FeatureState>,
  featuresLoading: boolean,
  evaluator: FeatureFlagEvaluator | undefined,
  names: string[],
  userId: string | undefined,
  tenantId: string | undefined,
  environment: Environment,
) {
  const staticFlags = Object.fromEntries(
    Object.entries(features).map(([name, value]) => [
      name,
      {
        enabled: value === true,
        loading: featuresLoading || value === 'loading',
        reason: value === true ? undefined : 'disabled',
      },
    ]),
  );

  if (!evaluator || names.length === 0) {
    return { flags: staticFlags, loading: featuresLoading };
  }

  const evaluated = Object.fromEntries(
    names.map((name) => [
      name,
      evaluator.evaluate(name, { userId, tenantId, environment }),
    ]),
  );

  return { flags: { ...staticFlags, ...evaluated }, loading: featuresLoading };
}

/** Wire apiFetch session events into runtime session state. */
export function SessionBridge() {
  const { setSession } = useRuntimeStore();

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ code?: number }>).detail;
      if (detail?.code === 401) setSession('expired');
      else if (detail?.code === 403) setSession('unauthorized');
    };
    window.addEventListener('larose:session-expired', handler);
    return () => window.removeEventListener('larose:session-expired', handler);
  }, [setSession]);

  return null;
}
