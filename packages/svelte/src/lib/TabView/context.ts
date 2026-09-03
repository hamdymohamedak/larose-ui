import { getContext, setContext } from 'svelte';

export interface TabViewContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

export const tabViewKey = Symbol('larose-tab-view');

export function setTabViewContext(value: () => TabViewContextValue): void {
  setContext(tabViewKey, value);
}

export function getTabViewContext(component: string): TabViewContextValue {
  const value = getContext<() => TabViewContextValue>(tabViewKey);
  if (!value) throw new Error(`${component} must be used within TabView`);
  return value();
}
