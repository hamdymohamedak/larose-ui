import { inject, type ComputedRef, type InjectionKey, type Ref } from 'vue';

export interface TabViewContextValue {
  value: Ref<string> | ComputedRef<string>;
  onValueChange: (value: string) => void;
  baseId: string;
}

export const tabViewKey: InjectionKey<TabViewContextValue> = Symbol('larose-tab-view');

export function useTabViewContext(component: string): TabViewContextValue {
  const context = inject(tabViewKey);
  if (!context) throw new Error(`${component} must be used within TabView`);
  return context;
}
