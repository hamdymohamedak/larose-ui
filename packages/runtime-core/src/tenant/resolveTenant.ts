import type { Density, TenantContext, ThemeMode } from '@larose-ui/core';
import { getThemePreset, type ThemePresetId } from '@larose-ui/themes';
import type { ColorTokens } from '@larose-ui/tokens';
import type { FeatureState } from '../types';
import type { Locale } from '../i18n/messages';

export interface TenantResolutionInput {
  tenant?: TenantContext;
  tenantId?: string;
  theme?: ThemeMode;
  density?: Density;
  brandColors?: Partial<ColorTokens>;
  locale?: Locale;
  timezone?: string;
  permissions?: string[];
  features?: Record<string, FeatureState>;
}

export interface ResolvedTenantConfig {
  tenantId?: string;
  tenant: TenantContext | null;
  theme: ThemeMode;
  density: Density;
  brandColors?: Partial<ColorTokens>;
  locale: Locale;
  timezone?: string;
  permissions: string[];
  features: Record<string, FeatureState>;
}

const PRESET_IDS = new Set(['default', 'refined', 'ocean', 'forest', 'sunset']);

function isThemePresetId(value: string): value is ThemePresetId {
  return PRESET_IDS.has(value);
}

/**
 * Resolves tenant-scoped defaults (theme, permissions, features) with explicit prop overrides.
 * Explicit LaRoseProvider props always win over tenant configuration.
 */
export function resolveTenantConfig(input: TenantResolutionInput): ResolvedTenantConfig {
  const tenant = input.tenant;
  const tenantId = tenant?.id ?? input.tenantId;

  let brandColors = input.brandColors ?? (tenant?.brandColors as Partial<ColorTokens> | undefined);
  let theme = input.theme ?? tenant?.theme ?? 'light';

  if (tenant?.themePreset && isThemePresetId(tenant.themePreset)) {
    const preset = getThemePreset(tenant.themePreset);
    theme = input.theme ?? tenant.theme ?? preset.mode;
    brandColors = {
      ...preset.colors,
      ...brandColors,
    };
  }

  const permissions =
    input.permissions !== undefined && input.permissions.length > 0
      ? input.permissions
      : (tenant?.permissions ?? input.permissions ?? []);

  const features =
    input.features && Object.keys(input.features).length > 0
      ? input.features
      : (tenant?.features ?? input.features ?? {});

  const locale = (input.locale ?? tenant?.locale ?? 'en') as Locale;
  const timezone = input.timezone ?? tenant?.timezone;

  const resolvedTenant: TenantContext | null = tenantId
    ? {
        id: tenantId,
        name: tenant?.name,
        locale: tenant?.locale ?? locale,
        timezone,
        theme,
        themePreset: tenant?.themePreset,
        permissions: tenant?.permissions,
        features: tenant?.features,
      }
    : null;

  return {
    tenantId,
    tenant: resolvedTenant,
    theme,
    density: input.density ?? 'comfortable',
    brandColors,
    locale,
    timezone,
    permissions,
    features,
  };
}
