import { inject, type InjectionKey } from 'vue';

export interface SplitViewContextValue {
  showPane: (id: string) => void;
  hidePane: (id: string) => void;
  hiddenPanes: Array<{ id: string; label: string }>;
}

export const splitViewKey: InjectionKey<SplitViewContextValue> = Symbol('larose-split-view');

export function useSplitView(): SplitViewContextValue {
  const context = inject(splitViewKey);
  if (!context) throw new Error('useSplitView must be used within SplitView');
  return context;
}
