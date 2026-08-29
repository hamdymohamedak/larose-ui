import type {
  Density,
  Environment,
  NetworkCondition,
  ThemeMode,
} from '../index';

export type SessionState =
  | 'authenticated'
  | 'unauthenticated'
  | 'refreshing'
  | 'expired'
  | 'revoked'
  | 'unauthorized';

export interface UserContext {
  id: string;
  name?: string;
  email?: string;
  roles?: string[];
  attributes?: Record<string, unknown>;
}

export interface TenantContext {
  id: string;
  name?: string;
  locale?: string;
  timezone?: string;
  theme?: ThemeMode;
  /** Named preset from @larose/themes (e.g. ocean, forest) */
  themePreset?: string;
  brandColors?: Record<string, string>;
  permissions?: string[];
  features?: Record<string, boolean | 'loading'>;
}

export interface FeatureFlagResult {
  enabled: boolean;
  loading: boolean;
  reason?: string;
  variant?: string;
}

export interface A11yPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface VersionMatrix {
  frontend: string;
  api?: string;
  feature?: string;
  compatible: boolean;
  warnings: string[];
}

export interface NetworkSnapshot {
  condition: NetworkCondition;
  online: boolean;
  effectiveType?: string;
  rtt?: number;
}

export interface PermissionSnapshot {
  granted: string[];
  loading: boolean;
}

export interface FeatureFlagSnapshot {
  flags: Record<string, FeatureFlagResult>;
  loading: boolean;
}

export interface OfflineSnapshot {
  status: string;
  queueLength: number;
}

export interface LocaleSnapshot {
  locale: string;
  dir: 'ltr' | 'rtl';
}

export interface ThemeSnapshot {
  mode: ThemeMode;
  density: Density;
  tenantId?: string;
}

/**
 * Unified read-only snapshot of the laRose frontend operating environment.
 * Consumed by DevTools, observability correlators, and application diagnostics.
 */
export interface LaRoseRuntimeContext {
  environment: Environment;
  tenant: TenantContext | null;
  user: UserContext | null;
  session: SessionState;
  permissions: PermissionSnapshot;
  features: FeatureFlagSnapshot;
  network: NetworkSnapshot;
  offline: OfflineSnapshot;
  locale: LocaleSnapshot;
  timezone: string;
  theme: ThemeSnapshot;
  accessibility: A11yPreferences;
  version: VersionMatrix;
}

export function createDefaultRuntimeContext(
  overrides: Partial<LaRoseRuntimeContext> = {},
): LaRoseRuntimeContext {
  return {
    environment: 'development',
    tenant: null,
    user: null,
    session: 'unauthenticated',
    permissions: { granted: [], loading: false },
    features: { flags: {}, loading: false },
    network: { condition: 'fast', online: true },
    offline: { status: 'idle', queueLength: 0 },
    locale: { locale: 'en', dir: 'ltr' },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: { mode: 'light', density: 'comfortable' },
    accessibility: { reducedMotion: false, highContrast: false },
    version: {
      frontend: '0.1.0',
      compatible: true,
      warnings: [],
    },
    ...overrides,
  };
}
