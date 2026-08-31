import { useEffect, useMemo, useRef } from 'react';
import { usePermissions } from '@larose-ui/permissions';
import type { SessionState } from '@larose-ui/core';
import {
  buildRuntimeContextPatch,
  createNetworkTransitionEvent,
  serializeRuntimePatch,
  sessionStateFromHttpCode,
  shouldClearOfflineQueueOnSession,
  type FeatureState,
  type RuntimeDomainInput,
} from '@larose-ui/runtime-core';
import { useEnvironment } from '../environment/EnvironmentProvider';
import { useI18n } from '../i18n/I18nProvider';
import { useNetwork } from '../network/NetworkProvider';
import { useOffline } from '../offline/OfflineProvider';
import { useTheme } from '../theme/ThemeProvider';
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
  version?: RuntimeDomainInput['version'];
  featureFlagEvaluator?: RuntimeDomainInput['featureFlagEvaluator'];
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

  useEffect(() => {
    if (session) setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    if (shouldClearOfflineQueueOnSession(session)) {
      offline.clear();
    }
  }, [session, offline]);

  useEffect(() => {
    const transition = createNetworkTransitionEvent(
      lastNetworkRef.current,
      network.condition,
      network.rtt,
    );
    if (transition) {
      eventBus.emit(transition);
      lastNetworkRef.current = network.condition;
    }
  }, [network.condition, network.rtt, eventBus]);

  useEffect(() => {
    const patch = buildRuntimeContextPatch({
      environment,
      locale,
      dir,
      network: {
        condition: network.condition,
        online: network.online,
        effectiveType: network.effectiveType,
        rtt: network.rtt,
      },
      offline: { status: offline.status, queueLength: offline.queue.length },
      permissions,
      permissionsLoading,
      theme: { mode: theme.theme, density: theme.density, tenantId: theme.tenantId },
      userId,
      user,
      tenant,
      tenantId,
      timezone,
      features,
      featuresLoading,
      version,
      featureFlagEvaluator,
      featureNames,
    });

    const serialized = serializeRuntimePatch(patch);
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
    theme.tenantId,
    userId,
    user,
    tenant,
    tenantId,
    timezone,
    version,
    features,
    featuresLoading,
    featureFlagEvaluator,
    featureNames,
    setContext,
  ]);

  return null;
}

/** Wire apiFetch session events into runtime session state. */
export function SessionBridge() {
  const { setSession } = useRuntimeStore();

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ code?: number }>).detail;
      const next = sessionStateFromHttpCode(detail?.code);
      if (next) setSession(next);
    };
    window.addEventListener('larose:session-expired', handler);
    return () => window.removeEventListener('larose:session-expired', handler);
  }, [setSession]);

  return null;
}
