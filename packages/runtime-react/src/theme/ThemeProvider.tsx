import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Density, ThemeMode } from '@larose-ui/core';
import { warnDeprecation } from '@larose-ui/core';
import { applyResolvedTheme, type ColorTokens } from '@larose-ui/tokens';
import {
  createTheme,
  resolveTheme,
  type ComponentConfiguration,
  type LaRoseTheme,
  type LaRoseThemeInput,
} from '@larose-ui/themes';

export type Appearance = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: ThemeMode;
  density: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  appearance?: Appearance;
  themeConfig?: LaRoseTheme;
  components?: ComponentConfiguration;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  density: 'comfortable',
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/** @deprecated Use useTheme() from @larose-ui/runtime-react */
export function useLaRose(): ThemeContextValue {
  warnDeprecation('useLaRose', 'useLaRose() is deprecated', 'useTheme()');
  return useTheme();
}

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

export interface ThemeProviderProps {
  theme?: ThemeMode;
  appearance?: Appearance;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  themeConfig?: LaRoseThemeInput | LaRoseTheme;
  themePreset?: LaRoseThemeInput['preset'];
  components?: ComponentConfiguration;
  children: ReactNode;
}

export function ThemeProvider({
  children,
  theme,
  appearance = 'system',
  density = 'comfortable',
  tenantId,
  brandColors,
  themeConfig,
  themePreset,
  components = {},
}: ThemeProviderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(() =>
    resolveAppearanceTheme(appearance),
  );

  useEffect(() => {
    if (appearance !== 'system' || typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'function') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemTheme(media.matches ? 'dark' : 'light');
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [appearance]);

  const activeTheme =
    theme ?? (appearance === 'system' ? systemTheme : resolveAppearanceTheme(appearance));

  const normalizedTheme = useMemo(
    () =>
      themeConfig
        ? 'tokens' in themeConfig && themeConfig.tokens
          ? (themeConfig as LaRoseTheme)
          : createTheme({ preset: themePreset ?? 'refined', ...themeConfig })
        : createTheme({ preset: themePreset ?? 'refined' }),
    [themeConfig, themePreset],
  );

  const resolved = useMemo(
    () =>
      resolveTheme({
        theme: normalizedTheme,
        density,
        mode: activeTheme,
        brandColors,
        components,
      }),
    [normalizedTheme, density, activeTheme, brandColors, components],
  );

  useLayoutEffect(() => {
    if (!ref.current) return;

    applyResolvedTheme(ref.current, {
      mode: resolved.mode,
      density: resolved.density,
      tokenOverrides: resolved.tokenOverrides,
      brandColors: resolved.brandColors,
      componentTokenOverrides: resolved.componentTokenOverrides,
      presetId: resolved.preset,
    });

    ref.current.dataset.lrTheme = activeTheme;
    ref.current.dataset.lrDensity = density;
    ref.current.dataset.lrAppearance = appearance;
    if (tenantId) {
      ref.current.dataset.lrTenant = tenantId;
    }
  }, [resolved, activeTheme, density, tenantId, appearance]);

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        density,
        tenantId,
        brandColors,
        appearance,
        themeConfig: normalizedTheme,
        components,
      }}
    >
      <div
        ref={ref}
        data-lr-provider
        style={{
          minHeight: 'inherit',
          color: 'var(--lr-color-text)',
          backgroundColor: 'var(--lr-color-background)',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
