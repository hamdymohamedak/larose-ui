import { inject, provide, type InjectionKey, computed, type ComputedRef } from 'vue';
import type { FeatureState } from '@larose-ui/runtime-core';

export interface FeatureFlagContextValue {
  features: Record<string, FeatureState>;
  loading: boolean;
  isEnabled: (name: string) => boolean;
  isLoading: (name: string) => boolean;
}

export const FEATURES_KEY: InjectionKey<ComputedRef<FeatureFlagContextValue>> =
  Symbol('larose-features');

export function provideFeatures(
  features: Record<string, FeatureState> = {},
  loading = false,
): ComputedRef<FeatureFlagContextValue> {
  const value = computed(() => ({
    features,
    loading,
    isEnabled: (name: string) => features[name] === true,
    isLoading: (name: string) => loading || features[name] === 'loading',
  }));
  provide(FEATURES_KEY, value);
  return value;
}

export function useFeature(name: string): { enabled: boolean; loading: boolean } {
  const ctx = inject(FEATURES_KEY, null)?.value;
  if (!ctx) return { enabled: false, loading: false };
  return { enabled: ctx.isEnabled(name), loading: ctx.isLoading(name) };
}
