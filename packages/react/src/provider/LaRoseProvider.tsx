import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { Density, ThemeMode } from '@larose-ui/core';
import { applyResolvedTheme, type ColorTokens } from '@larose-ui/tokens';
import {
  createTheme,
  normalizeThemeInput,
  resolveTheme,
  type ComponentConfiguration,
  type LaRoseTheme,
  type LaRoseThemeInput,
} from '@larose-ui/themes';
import { AcceleratorProvider } from '../accelerator/AcceleratorProvider';
import { MotionProvider, type MotionConfig } from '../Motion/MotionContext';
import {
  ThemeCustomizationContext,
  type ThemeCustomizationContextValue,
} from '../theme/ThemeCustomizationContext';

export interface LaRoseConfig {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  motion?: MotionConfig;
  /** Full theme configuration with token overrides. */
  themeConfig?: LaRoseThemeInput | LaRoseTheme;
  /** Per-component defaults, tokens, and motion overrides. */
  components?: ComponentConfiguration;
}

const LaRoseContext = createContext<LaRoseConfig>({
  theme: 'light',
  density: 'comfortable',
});

export function useLaRose(): LaRoseConfig {
  return useContext(LaRoseContext);
}

export interface LaRoseProviderProps extends LaRoseConfig {
  children: ReactNode;
}

/**
 * Lightweight theme + motion + accelerator provider for apps that do not use `@larose-ui/runtime-react`.
 * For the full platform stack (i18n, permissions, network, offline, runtime context), use
 * `LaRoseProvider` from `@larose-ui/runtime-react` instead — it includes accelerators automatically.
 */
export function LaRoseProvider({
  children,
  theme = 'light',
  density = 'comfortable',
  tenantId,
  brandColors,
  motion,
  themeConfig,
  components = {},
}: LaRoseProviderProps) {
  const ref = useRef<HTMLDivElement>(null);

  const normalizedTheme = useMemo(
    () =>
      themeConfig
        ? 'tokens' in themeConfig && themeConfig.tokens
          ? (themeConfig as LaRoseTheme)
          : createTheme(themeConfig)
        : createTheme({ preset: 'refined' }),
    [themeConfig],
  );

  const resolved = useMemo(
    () =>
      resolveTheme({
        theme: normalizedTheme,
        density,
        mode: theme,
        brandColors,
        components,
      }),
    [normalizedTheme, density, theme, brandColors, components],
  );

  const customizationValue = useMemo<ThemeCustomizationContextValue>(
    () => ({
      theme: normalizedTheme,
      resolved,
      components,
    }),
    [normalizedTheme, resolved, components],
  );

  const providerConfig = useMemo<LaRoseConfig>(
    () => ({
      theme,
      density,
      tenantId,
      brandColors,
      motion,
      themeConfig: normalizedTheme,
      components,
    }),
    [theme, density, tenantId, brandColors, motion, normalizedTheme, components],
  );

  useEffect(() => {
    if (!ref.current) return;

    applyResolvedTheme(ref.current, {
      mode: resolved.mode,
      density: resolved.density,
      tokenOverrides: resolved.tokenOverrides,
      brandColors: resolved.brandColors,
      componentTokenOverrides: resolved.componentTokenOverrides,
      presetId: resolved.preset,
    });

    if (tenantId) {
      ref.current.dataset.lrTenant = tenantId;
    }
  }, [resolved, tenantId]);

  const motionConfig = useMemo<MotionConfig>(
    () => ({
      preset: motion?.preset ?? normalizedTheme.motion?.preset,
      reducedMotion: motion?.reducedMotion ?? normalizedTheme.motion?.reducedMotion,
    }),
    [motion, normalizedTheme.motion],
  );

  return (
    <LaRoseContext.Provider value={providerConfig}>
      <ThemeCustomizationContext.Provider value={customizationValue}>
        <MotionProvider {...motionConfig}>
          <AcceleratorProvider>
            <div
              ref={ref}
              data-lr-provider
              data-lr-portal-root
              style={{
                minHeight: 'inherit',
                color: 'var(--lr-color-text)',
                backgroundColor: 'var(--lr-color-background)',
              }}
            >
              {children}
            </div>
          </AcceleratorProvider>
        </MotionProvider>
      </ThemeCustomizationContext.Provider>
    </LaRoseContext.Provider>
  );
}

export { createTheme, normalizeThemeInput, resolveTheme };
export type {
  LaRoseTheme,
  LaRoseThemeInput,
  ComponentConfiguration,
} from '@larose-ui/themes';
