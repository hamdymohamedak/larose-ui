import type { ComponentDefaultPropsMap } from '@larose-ui/themes';
import { useThemeCustomization } from './useThemeCustomization';

export function useComponentDefaults<
  TName extends keyof ComponentDefaultPropsMap,
  TProps extends Partial<ComponentDefaultPropsMap[TName]>,
>(component: TName, props: TProps): TProps {
  const customization = useThemeCustomization();
  const defaults = customization.value.components[component]?.defaultProps ?? {};
  return { ...defaults, ...props };
}
