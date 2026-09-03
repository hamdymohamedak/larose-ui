import { inject, provide, type InjectionKey, type Ref } from 'vue';

export interface TabsContextValue {
  value: Ref<string>;
  onValueChange: (value: string) => void;
  baseId: string;
}

export const tabsKey: InjectionKey<TabsContextValue> = Symbol('larose.tabs');

export function provideTabs(value: TabsContextValue) {
  provide(tabsKey, value);
}

export function useTabsContext(component: string): TabsContextValue {
  const ctx = inject(tabsKey, null);
  if (!ctx) throw new Error(`${component} must be used within Tabs`);
  return ctx;
}
