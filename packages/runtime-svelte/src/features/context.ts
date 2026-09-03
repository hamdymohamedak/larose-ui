import { getContext, setContext } from 'svelte';
import type { FeatureState } from '@larose-ui/runtime-core';

export interface FeatureFlagContextValue {
  features: Record<string, FeatureState>;
  loading: boolean;
  isEnabled: (name: string) => boolean;
  isLoading: (name: string) => boolean;
}

export const FEATURES_CONTEXT = 'larose-features';

export function createFeatureContext(
  features: Record<string, FeatureState> = {},
  loading = false,
): FeatureFlagContextValue {
  return {
    features,
    loading,
    isEnabled: (name) => features[name] === true,
    isLoading: (name) => loading || features[name] === 'loading',
  };
}

export function setFeaturesContext(value: FeatureFlagContextValue): void {
  setContext(FEATURES_CONTEXT, value);
}

export function getFeature(name: string): { enabled: boolean; loading: boolean } {
  const ctx = getContext<FeatureFlagContextValue | undefined>(FEATURES_CONTEXT);
  if (!ctx) return { enabled: false, loading: false };
  return { enabled: ctx.isEnabled(name), loading: ctx.isLoading(name) };
}
