import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  detectA11yPreferences,
  resolveReducedMotion,
  subscribeA11yPreferences,
  type ReducedMotionPolicy,
  type MotionSemanticPreset,
} from '@larose-ui/core';
import { defaultMotionConfig, type MotionConfig } from './types';

export interface MotionContextValue {
  preset: MotionSemanticPreset;
  reducedMotion: ReducedMotionPolicy;
  prefersReducedMotion: boolean;
  motionEnabled: boolean;
}

const defaultMotionContextValue: MotionContextValue = (() => {
  const prefersReducedMotion =
    typeof window !== 'undefined' ? detectA11yPreferences().reducedMotion : false;
  return {
    preset: 'smooth',
    reducedMotion: 'system',
    prefersReducedMotion,
    motionEnabled: !prefersReducedMotion,
  };
})();

const MotionContext = createContext<MotionContextValue>(defaultMotionContextValue);

export function useMotion(): MotionContextValue {
  return useContext(MotionContext);
}

export interface MotionProviderProps extends MotionConfig {
  children: ReactNode;
}

export function MotionProvider({
  children,
  preset = defaultMotionConfig.preset,
  reducedMotion = defaultMotionConfig.reducedMotion,
}: MotionProviderProps) {
  const [systemReduced, setSystemReduced] = useState(() =>
    typeof window !== 'undefined' ? detectA11yPreferences().reducedMotion : false,
  );

  useEffect(() => subscribeA11yPreferences((prefs) => setSystemReduced(prefs.reducedMotion)), []);

  const prefersReducedMotion = resolveReducedMotion(
    reducedMotion ?? 'system',
    systemReduced,
  );

  const motionEnabled = preset !== 'none' && !prefersReducedMotion;

  const value = useMemo(
    () => ({
      preset: preset ?? 'smooth',
      reducedMotion: reducedMotion ?? 'system',
      prefersReducedMotion,
      motionEnabled,
    }),
    [preset, reducedMotion, prefersReducedMotion, motionEnabled],
  );

  return (
    <MotionContext.Provider value={value}>
      <div data-lr-motion={motionEnabled ? 'on' : 'off'} style={{ display: 'contents' }}>
        {children}
      </div>
    </MotionContext.Provider>
  );
}

/** Returns whether a specific animation should run. */
export function useMotionEnabled(): boolean {
  return useMotion().motionEnabled;
}

export function useSkipMotion(): boolean {
  return !useMotion().motionEnabled;
}

// Re-export for convenience in components
export type { MotionConfig };
