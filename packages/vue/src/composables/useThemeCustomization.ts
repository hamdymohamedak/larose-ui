import { computed, inject, unref, type ComputedRef, type InjectionKey, type MaybeRef } from 'vue';
import { createTheme } from '@larose-ui/themes';
import type { ThemeCustomizationContextValue } from '../theme/types';
import { themeCustomizationKey } from '../theme/types';

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

export function useThemeCustomization(): ComputedRef<ThemeCustomizationContextValue> {
  const value = inject(
    themeCustomizationKey as InjectionKey<MaybeRef<ThemeCustomizationContextValue>>,
    defaultValue,
  );
  return computed(() => unref(value) ?? defaultValue);
}
