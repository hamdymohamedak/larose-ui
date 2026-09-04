<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
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
} from '@larose-ui/observability-vue';
import { PermissionProvider } from '@larose-ui/permissions-vue';
import { LaRoseProvider as ThemeShell, AcceleratorProvider } from '@larose-ui/vue';
import EnvironmentProvider from './environment/EnvironmentProvider.vue';
import FeatureFlagProvider from './features/FeatureFlagProvider.vue';
import I18nProvider from './i18n/I18nProvider.vue';
import NetworkProvider from './network/NetworkProvider.vue';
import OfflineProvider from './offline/OfflineProvider.vue';
import ResponsiveProvider from './responsive/ResponsiveProvider.vue';
import RuntimeProvider from './runtime/RuntimeProvider.vue';
import AutoSync from './runtime/AutoSync.vue';
import OptionalToastProvider from './toast/OptionalToastProvider.vue';

export type Appearance = 'light' | 'dark' | 'system';

export interface LaRoseProviderProps {
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
}

const props = withDefaults(defineProps<LaRoseProviderProps>(), {
  appearance: 'system',
  themePreset: 'refined',
  density: 'comfortable',
  locale: 'en',
  environment: 'development',
  permissions: () => [],
  permissionsLoading: false,
  features: () => ({}),
  featuresLoading: false,
  enableToasts: true,
  toastPlacement: 'bottom-right',
  components: () => ({}),
});

function resolveAppearanceTheme(appearance: Appearance): ThemeMode {
  if (appearance === 'system') {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }
  return appearance;
}

const systemTheme = ref<ThemeMode>(resolveAppearanceTheme(props.appearance));

onMounted(() => {
  if (props.appearance !== 'system' || typeof window === 'undefined') return;
  if (typeof window.matchMedia !== 'function') return;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const update = () => {
    systemTheme.value = media.matches ? 'dark' : 'light';
  };
  update();
  media.addEventListener('change', update);
  onUnmounted(() => media.removeEventListener('change', update));
});

watch(
  () => props.appearance,
  (appearance) => {
    systemTheme.value = resolveAppearanceTheme(appearance);
  },
);

const activeTheme = computed(
  () =>
    props.theme ??
    (props.appearance === 'system' ? systemTheme.value : resolveAppearanceTheme(props.appearance)),
);

const adapter = computed(
  () =>
    props.observabilityAdapter ??
    (props.observabilityDebug ? createConsoleAdapter() : createNoopAdapter()),
);

const brandColors = computed(() => {
  const presetColors =
    props.themePreset !== 'refined' ? getThemePreset(props.themePreset).colors : undefined;
  return {
    ...presetColors,
    ...props.brandColors,
    ...(props.tenant?.brandColors as Partial<ColorTokens> | undefined),
  };
});

const normalizedTheme = computed(() =>
  props.themeConfig
    ? 'tokens' in props.themeConfig && props.themeConfig.tokens
      ? (props.themeConfig as LaRoseTheme)
      : createTheme({ preset: props.themePreset, ...props.themeConfig })
    : createTheme({ preset: props.themePreset }),
);

const resolvedTenant = computed(() =>
  resolveTenantConfig({
    tenant: props.tenant,
    tenantId: props.tenantId,
    theme: activeTheme.value,
    density: props.density,
    brandColors: brandColors.value,
    locale: props.locale,
    timezone: props.timezone,
    permissions: props.permissions,
    features: props.features,
  }),
);

const offlineScopeId = computed(() => {
  const parts = [resolvedTenant.value.tenantId, props.userId ?? props.user?.id].filter(Boolean);
  return parts.length > 0 ? parts.join(':') : undefined;
});

const initialRuntimeContext = computed(() => ({
  environment: props.environment,
  session:
    props.session ??
    (props.user || props.userId ? ('authenticated' as const) : ('unauthenticated' as const)),
  timezone: resolvedTenant.value.timezone,
  version: {
    frontend: props.version?.frontend ?? LAROSE_VERSION,
    api: props.version?.api,
    feature: props.version?.feature,
    compatible: props.version?.compatible ?? true,
    warnings: props.version?.warnings ?? [],
  },
}));
</script>

<template>
  <ThemeShell
    :theme="resolvedTenant.theme"
    :density="resolvedTenant.density"
    :tenant-id="resolvedTenant.tenantId"
    :brand-colors="resolvedTenant.brandColors"
    :theme-config="normalizedTheme"
    :components="components"
  >
    <AcceleratorProvider>
      <OptionalToastProvider :enabled="enableToasts" :placement="toastPlacement">
        <ObservabilityProvider
          :adapter="adapter"
          :tenant-id="resolvedTenant.tenantId"
          :user-id="userId ?? user?.id"
          :debug="observabilityDebug"
        >
          <I18nProvider :locale="resolvedTenant.locale">
            <PermissionProvider
              :permissions="resolvedTenant.permissions"
              :loading="permissionsLoading"
              :context="{ userId: userId ?? user?.id, tenantId: resolvedTenant.tenantId }"
            >
              <FeatureFlagProvider
                :features="resolvedTenant.features"
                :loading="featuresLoading"
              >
                <EnvironmentProvider :environment="environment">
                  <ResponsiveProvider>
                    <NetworkProvider>
                      <OfflineProvider :scope-id="offlineScopeId">
                        <AutoSync :session="session">
                          <RuntimeProvider :initial-context="initialRuntimeContext">
                            <slot />
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
</template>
