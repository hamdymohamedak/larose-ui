import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Density, ThemeMode } from '@larose-ui/core';
import { warnDeprecation } from '@larose-ui/core';
import { applyTokensToElement, type ColorTokens } from '@larose-ui/tokens';

export type Appearance = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: ThemeMode;
  density: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  appearance?: Appearance;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  density: 'comfortable',
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/** @deprecated Use useTheme() from @larose-ui/runtime */
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
  children: ReactNode;
}

export function ThemeProvider({
  children,
  theme,
  appearance = 'system',
  density = 'comfortable',
  tenantId,
  brandColors,
}: ThemeProviderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const resolvedTheme = theme ?? resolveAppearanceTheme(appearance);
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

  useEffect(() => {
    if (ref.current) {
      applyTokensToElement(ref.current, activeTheme, density, brandColors);
      ref.current.dataset.lrTheme = activeTheme;
      ref.current.dataset.lrDensity = density;
      ref.current.dataset.lrAppearance = appearance;
      if (tenantId) {
        ref.current.dataset.lrTenant = tenantId;
      }
    }
  }, [activeTheme, density, tenantId, brandColors, appearance]);

  return (
    <ThemeContext.Provider
      value={{ theme: activeTheme, density, tenantId, brandColors, appearance }}
    >
      <div ref={ref} data-lr-provider style={{ minHeight: 'inherit' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
