import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { Density, ThemeMode } from '@larose/core';
import { applyTokensToElement, type ColorTokens } from '@larose/tokens';

export interface LaRoseConfig {
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  brandColors?: Partial<ColorTokens>;
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

export function LaRoseProvider({
  children,
  theme = 'light',
  density = 'comfortable',
  tenantId,
  brandColors,
}: LaRoseProviderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      applyTokensToElement(ref.current, theme, density, brandColors);
      if (tenantId) {
        ref.current.dataset.lrTenant = tenantId;
      }
    }
  }, [theme, density, tenantId, brandColors]);

  return (
    <LaRoseContext.Provider value={{ theme, density, tenantId, brandColors }}>
      <div ref={ref} data-lr-provider style={{ minHeight: 'inherit' }}>
        {children}
      </div>
    </LaRoseContext.Provider>
  );
}
