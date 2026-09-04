import { getContext, setContext } from 'svelte';

export interface TabsContextValue {
  get value(): string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const tabsKey = Symbol('larose-tabs');

export function setTabsContext(value: TabsContextValue): void {
  setContext(tabsKey, value);
}

export function getTabsContext(component: string): TabsContextValue {
  const context = getContext<TabsContextValue>(tabsKey);
  if (!context) {
    throw new Error(`${component} must be used within Tabs`);
  }
  return context;
}
