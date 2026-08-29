import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { Density, ThemeMode } from '@larose-ui/core';
import { warnDeprecation } from '@larose-ui/core';
import { applyTokensToElement, type ColorTokens } from '@larose-ui/tokens';

export interface ThemeContextValue {
  theme: ThemeMode;
  density: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
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

export interface ThemeProviderProps {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
  children: ReactNode;
}

export function ThemeProvider({
  children,
  theme = 'light',
  density = 'comfortable',
  tenantId,
  brandColors,
}: ThemeProviderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      applyTokensToElement(ref.current, theme, density, brandColors);
      ref.current.dataset.lrTheme = theme;
      ref.current.dataset.lrDensity = density;
      if (tenantId) {
        ref.current.dataset.lrTenant = tenantId;
      }
    }
  }, [theme, density, tenantId, brandColors]);

  return (
    <ThemeContext.Provider value={{ theme, density, tenantId, brandColors }}>
      <div ref={ref} data-lr-provider style={{ minHeight: 'inherit' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
