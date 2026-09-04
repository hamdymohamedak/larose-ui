<script lang="ts">
  import type { Snippet } from 'svelte';
  import type {
    Density,
    Environment,
    SessionState,
    ThemeMode,
    UserContext,
    TenantContext,
  } from '@larose-ui/core';
  import { LAROSE_VERSION } from '@larose-ui/core';
  import type { ColorTokens } from '@larose-ui/tokens';
  import {
    createTheme,
    getThemePreset,
    type ComponentConfiguration,
    type LaRoseTheme,
    type LaRoseThemeInput,
    type ThemePresetId,
  } from '@larose-ui/themes';
  import type { FeatureState, Locale } from '@larose-ui/runtime-core';
  import { resolveTenantConfig } from '@larose-ui/runtime-core';
  import {
    ObservabilityProvider,
    createConsoleAdapter,
    createNoopAdapter,
    type ObservabilityAdapter,
  } from '@larose-ui/observability-svelte';
  import { PermissionProvider } from '@larose-ui/permissions-svelte';
  import {
    LaRoseProvider as ThemeShell,
    AcceleratorProvider,
  } from '@larose-ui/svelte';
  import EnvironmentProvider from './environment/EnvironmentProvider.svelte';
  import FeatureFlagProvider from './features/FeatureFlagProvider.svelte';
  import I18nProvider from './i18n/I18nProvider.svelte';
  import NetworkProvider from './network/NetworkProvider.svelte';
  import OfflineProvider from './offline/OfflineProvider.svelte';
  import ResponsiveProvider from './responsive/ResponsiveProvider.svelte';
  import RuntimeProvider from './runtime/RuntimeProvider.svelte';
  import AutoSync from './runtime/AutoSync.svelte';
  import OptionalToastProvider from './toast/OptionalToastProvider.svelte';

  export type Appearance = 'light' | 'dark' | 'system';

  interface Props {
    theme?: ThemeMode;
    appearance?: Appearance;
    density?: Density;
    themePreset?: 'refined' | ThemePresetId;
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
    enableToasts?: boolean;
    toastPlacement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    themeConfig?: LaRoseThemeInput | LaRoseTheme;
    components?: ComponentConfiguration;
    children?: Snippet;
  }

  let {
    theme,
    appearance = 'system',
    density = 'comfortable',
    themePreset = 'refined',
    tenantId,
    tenant,
    brandColors: brandColorsProp,
    locale = 'en',
    timezone,
    environment = 'development',
    permissions = [],
    permissionsLoading = false,
    features = {},
    featuresLoading = false,
    observabilityAdapter,
    observabilityDebug,
    userId,
    user,
    session,
    version,
    enableToasts = true,
    toastPlacement = 'bottom-right',
    themeConfig,
    components = {},
    children,
  }: Props = $props();

  function resolveAppearanceTheme(value: Appearance): ThemeMode {
    if (value === 'system') {
      if (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
      return 'light';
    }
    return value;
  }

  let systemTheme = $state<ThemeMode>(resolveAppearanceTheme(appearance));

  $effect(() => {
    if (appearance !== 'system' || typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      systemTheme = media.matches ? 'dark' : 'light';
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  });

  const activeTheme = $derived(
    theme ?? (appearance === 'system' ? systemTheme : resolveAppearanceTheme(appearance)),
  );

  const adapter = $derived(
    observabilityAdapter ?? (observabilityDebug ? createConsoleAdapter() : createNoopAdapter()),
  );

  const brandColors = $derived({
    ...(themePreset !== 'refined' ? getThemePreset(themePreset).colors : undefined),
    ...brandColorsProp,
    ...(tenant?.brandColors as Partial<ColorTokens> | undefined),
  });

  const normalizedTheme = $derived(
    themeConfig
      ? 'tokens' in themeConfig && themeConfig.tokens
        ? (themeConfig as LaRoseTheme)
        : createTheme({ preset: themePreset, ...themeConfig })
      : createTheme({ preset: themePreset }),
  );

  const resolvedTenant = $derived(
    resolveTenantConfig({
      tenant,
      tenantId,
      theme: activeTheme,
      density,
      brandColors,
      locale,
      timezone,
      permissions,
      features,
    }),
  );

  const offlineScopeId = $derived.by(() => {
    const parts = [resolvedTenant.tenantId, userId ?? user?.id].filter(Boolean);
    return parts.length > 0 ? parts.join(':') : undefined;
  });

  const initialRuntimeContext = $derived({
    environment,
    session: session ?? (user || userId ? ('authenticated' as const) : ('unauthenticated' as const)),
    timezone: resolvedTenant.timezone,
    version: {
      frontend: version?.frontend ?? LAROSE_VERSION,
      api: version?.api,
      feature: version?.feature,
      compatible: version?.compatible ?? true,
      warnings: version?.warnings ?? [],
    },
  });
</script>

<ThemeShell
  theme={resolvedTenant.theme}
  density={resolvedTenant.density}
  tenantId={resolvedTenant.tenantId}
  brandColors={resolvedTenant.brandColors}
  themeConfig={normalizedTheme}
  {components}
>
  <AcceleratorProvider>
    <OptionalToastProvider enabled={enableToasts} placement={toastPlacement}>
      <ObservabilityProvider
        adapter={adapter}
        tenantId={resolvedTenant.tenantId}
        userId={userId ?? user?.id}
        debug={observabilityDebug}
      >
        <I18nProvider locale={resolvedTenant.locale}>
          <PermissionProvider
            permissions={resolvedTenant.permissions}
            loading={permissionsLoading}
            context={{ userId: userId ?? user?.id, tenantId: resolvedTenant.tenantId }}
          >
            <FeatureFlagProvider features={resolvedTenant.features} loading={featuresLoading}>
              <EnvironmentProvider {environment}>
                <ResponsiveProvider>
                  <NetworkProvider>
                    <OfflineProvider scopeId={offlineScopeId}>
                      <AutoSync {session}>
                        <RuntimeProvider initialContext={initialRuntimeContext}>
                          {@render children?.()}
                        </RuntimeProvider>
                      </AutoSync>
                    </OfflineProvider>
                  </NetworkProvider>
                </ResponsiveProvider>
              </EnvironmentProvider>
            </FeatureFlagProvider>
          </PermissionProvider>
        </I18nProvider>
      </ObservabilityProvider>
    </OptionalToastProvider>
  </AcceleratorProvider>
</ThemeShell>
