import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

export type FeatureState = import('@larose-ui/runtime-core').FeatureState;

export interface FeatureFlagContextValue {
  features: Record<string, FeatureState>;
  loading: boolean;
  isEnabled: (name: string) => boolean;
  isLoading: (name: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  features: {},
  loading: false,
  isEnabled: () => false,
  isLoading: () => false,
});

export function useFeature(name: string): { enabled: boolean; loading: boolean } {
  const ctx = useContext(FeatureFlagContext);
  return {
    enabled: ctx.isEnabled(name),
    loading: ctx.isLoading(name),
  };
}

export interface FeatureFlagProviderProps {
  features?: Record<string, FeatureState>;
  loading?: boolean;
  children: ReactNode;
}

export function FeatureFlagProvider({
  features = {},
  loading = false,
  children,
}: FeatureFlagProviderProps) {
  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      features,
      loading,
      isEnabled: (name) => features[name] === true,
      isLoading: (name) => loading || features[name] === 'loading',
    }),
    [features, loading],
  );

  return (
    <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
  );
}

export interface FeatureProps {
  name: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Feature({ name, children, fallback = null }: FeatureProps) {
  const { enabled, loading } = useFeature(name);

  if (loading) {
    return <span aria-busy="true" data-feature={name} />;
  }

  if (!enabled) return <>{fallback}</>;

  return <>{children}</>;
}
