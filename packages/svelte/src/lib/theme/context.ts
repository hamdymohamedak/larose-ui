import { getContext } from 'svelte';
import { createTheme } from '@larose-ui/themes';
import type { ComponentConfiguration, LaRoseTheme, ResolvedLaRoseTheme } from '@larose-ui/themes';
import type { ComponentDefaultPropsMap } from '@larose-ui/themes';

export interface ThemeCustomizationContextValue {
  theme: LaRoseTheme;
  resolved: ResolvedLaRoseTheme;
  components: ComponentConfiguration;
}

export const themeCustomizationKey = Symbol('larose-theme-customization');

const defaultValue: ThemeCustomizationContextValue = {
  theme: createTheme({ preset: 'refined' }),
  resolved: {
    mode: 'light',
    density: 'comfortable',
    preset: 'refined',
    tokenOverrides: {},
    brandColors: {},
    componentTokenOverrides: {},
    motion: {},
  },
  components: {},
};

export function getThemeCustomization(): ThemeCustomizationContextValue {
  const value = getContext<ThemeCustomizationContextValue | (() => ThemeCustomizationContextValue)>(
    themeCustomizationKey,
  );
  if (typeof value === 'function') return value();
  return value ?? defaultValue;
}

export function getComponentDefaults<
  TName extends keyof ComponentDefaultPropsMap,
  TProps extends Partial<ComponentDefaultPropsMap[TName]>,
>(component: TName, props: TProps): TProps {
  const { components } = getThemeCustomization();
  const defaults = components[component]?.defaultProps ?? {};
  return { ...defaults, ...props };
}
