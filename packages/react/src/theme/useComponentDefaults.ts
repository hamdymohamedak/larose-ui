import { mergeDefinedProps } from '@larose-ui/core';
import type { ComponentDefaultPropsMap } from '@larose-ui/themes';
import { useThemeCustomization } from './ThemeCustomizationContext';

/**
 * Merge global component defaults with instance props.
 * Instance props win, but `undefined` does not wipe defaults.
 */
export function useComponentDefaults<
  TName extends keyof ComponentDefaultPropsMap,
  TProps extends Partial<ComponentDefaultPropsMap[TName]>,
>(component: TName, props: TProps): TProps {
  const { components } = useThemeCustomization();
  const defaults = (components[component]?.defaultProps ?? {}) as Partial<TProps>;

  return mergeDefinedProps(
    defaults as Record<string, unknown>,
    props as Record<string, unknown>,
  ) as TProps;
}
