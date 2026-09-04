import { mergeDefinedProps } from '@larose-ui/core';
import type { ComponentDefaultPropsMap } from '@larose-ui/themes';
import { useThemeCustomization } from './useThemeCustomization';

export function useComponentDefaults<
  TName extends keyof ComponentDefaultPropsMap,
  TProps extends Partial<ComponentDefaultPropsMap[TName]>,
>(component: TName, props: TProps): TProps {
  const customization = useThemeCustomization();
  const defaults = (customization.value.components[component]?.defaultProps ??
    {}) as Partial<TProps>;
  return mergeDefinedProps(
    defaults as Record<string, unknown>,
    props as Record<string, unknown>,
  ) as TProps;
}
