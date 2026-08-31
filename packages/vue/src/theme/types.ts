import type { ComponentConfiguration, LaRoseTheme, ResolvedLaRoseTheme } from '@larose-ui/themes';

export interface ThemeCustomizationContextValue {
  theme: LaRoseTheme;
  resolved: ResolvedLaRoseTheme;
  components: ComponentConfiguration;
}

export const themeCustomizationKey = Symbol('larose-theme-customization');
