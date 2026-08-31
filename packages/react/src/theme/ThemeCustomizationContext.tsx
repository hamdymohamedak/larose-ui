import { createContext, useContext } from 'react';
import type {
  ComponentConfiguration,
  LaRoseTheme,
  LaRoseThemeInput,
  ResolvedLaRoseTheme,
} from '@larose-ui/themes';

export interface ThemeCustomizationContextValue {
  theme: LaRoseTheme;
  resolved: ResolvedLaRoseTheme;
  components: ComponentConfiguration;
}

const defaultContextValue: ThemeCustomizationContextValue = {
  theme: { preset: 'refined', tokens: {}, motion: {} },
  resolved: {
    preset: 'refined',
    mode: 'light',
    density: 'comfortable',
    tokenOverrides: {},
    brandColors: {},
    componentTokenOverrides: {},
    motion: {},
  },
  components: {},
};

export const ThemeCustomizationContext =
  createContext<ThemeCustomizationContextValue>(defaultContextValue);

export function useThemeCustomization(): ThemeCustomizationContextValue {
  return useContext(ThemeCustomizationContext);
}

export type { LaRoseTheme, LaRoseThemeInput, ComponentConfiguration, ResolvedLaRoseTheme };
