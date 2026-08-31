import type {
  Environment,
  FeatureFlagEvaluator,
  LaRoseRuntimeContext,
  NetworkCondition,
  SessionState,
  TenantContext,
  UserContext,
} from '@larose-ui/core';
import type { FeatureState } from './types';

export interface VersionInput {
  frontend: string;
  api?: string;
  feature?: string;
  compatible?: boolean;
  warnings?: string[];
}

export interface RuntimeDomainInput {
  environment: Environment;
  locale: string;
  dir: 'ltr' | 'rtl';
  network: {
    condition: NetworkCondition;
    online: boolean;
    effectiveType?: string;
    rtt?: number;
  };
  offline: {
    status: string;
    queueLength: number;
  };
  permissions: string[];
  permissionsLoading: boolean;
  theme: {
    mode: LaRoseRuntimeContext['theme']['mode'];
    density: LaRoseRuntimeContext['theme']['density'];
    tenantId?: string;
  };
  user?: UserContext | null;
  userId?: string;
  tenant?: TenantContext | null;
  tenantId?: string;
  timezone?: string;
  features?: Record<string, FeatureState>;
  featuresLoading?: boolean;
  version?: VersionInput;
  featureFlagEvaluator?: FeatureFlagEvaluator;
  featureNames?: string[];
}

export function buildFeatureSnapshot(
  features: Record<string, FeatureState>,
  featuresLoading: boolean,
  evaluator: FeatureFlagEvaluator | undefined,
  names: string[],
  userId: string | undefined,
  tenantId: string | undefined,
  environment: Environment,
): LaRoseRuntimeContext['features'] {
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

/** Build the partial runtime context patch from domain provider snapshots. */
export function buildRuntimeContextPatch(input: RuntimeDomainInput): Partial<LaRoseRuntimeContext> {
  const resolvedTenantId = input.tenant?.id ?? input.tenantId ?? input.theme.tenantId;
  const resolvedTimezone =
    input.timezone ??
    input.tenant?.timezone ??
    (typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC');

  const resolvedUser = input.user ?? (input.userId ? { id: input.userId } : null);
  const resolvedTenant = resolvedTenantId
    ? {
        id: resolvedTenantId,
        name: input.tenant?.name,
        locale: input.tenant?.locale,
        timezone: input.tenant?.timezone,
      }
    : null;

  const featureSnapshot = buildFeatureSnapshot(
    input.features ?? {},
    input.featuresLoading ?? false,
    input.featureFlagEvaluator,
    input.featureNames ?? [],
    input.userId ?? input.user?.id,
    resolvedTenantId,
    input.environment,
  );

  return {
    environment: input.environment,
    tenant: resolvedTenant,
    user: resolvedUser,
    permissions: { granted: input.permissions, loading: input.permissionsLoading },
    features: featureSnapshot,
    network: {
      condition: input.network.condition,
      online: input.network.online,
      effectiveType: input.network.effectiveType,
      rtt: input.network.rtt,
    },
    offline: { status: input.offline.status, queueLength: input.offline.queueLength },
    locale: { locale: input.locale, dir: input.dir },
    timezone: resolvedTimezone,
    theme: {
      mode: input.theme.mode,
      density: input.theme.density,
      tenantId: resolvedTenantId,
    },
    ...(input.version
      ? {
          version: {
            frontend: input.version.frontend,
            api: input.version.api,
            feature: input.version.feature,
            compatible: input.version.compatible ?? true,
            warnings: input.version.warnings ?? [],
          },
        }
      : {}),
  };
}

export function serializeRuntimePatch(patch: Partial<LaRoseRuntimeContext>): string {
  return JSON.stringify(patch);
}

export function createNetworkTransitionEvent(
  from: NetworkCondition,
  to: NetworkCondition,
  rtt?: number,
) {
  if (from === to) return null;
  return {
    type: 'network.transition' as const,
    metadata: { from, to, rtt },
  };
}

export function sessionStateFromHttpCode(code?: number): SessionState | null {
  if (code === 401) return 'expired';
  if (code === 403) return 'unauthorized';
  return null;
}
