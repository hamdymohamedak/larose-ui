import type { ComponentDefaultPropsMap } from '@larose-ui/themes';
import { useThemeCustomization } from './ThemeCustomizationContext';

/**
 * Merge global component defaults with instance props.
 * Instance props always win.
 */
export function useComponentDefaults<
  TName extends keyof ComponentDefaultPropsMap,
  TProps extends Partial<ComponentDefaultPropsMap[TName]>,
>(component: TName, props: TProps): TProps {
  const { components } = useThemeCustomization();
  const defaults = components[component]?.defaultProps ?? {};

  return {
    ...defaults,
    ...props,
  };
}
