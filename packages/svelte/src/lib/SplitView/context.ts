import { getContext, setContext } from 'svelte';
import type { SplitPaneConfig } from './types';
import type { Snippet } from 'svelte';

export interface SplitPaneRuntime extends SplitPaneConfig {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
  ariaLabel?: string;
  content?: Snippet;
}

export interface SplitViewContextValue {
  showPane: (id: string) => void;
  hidePane: (id: string) => void;
  hiddenPanes: Array<{ id: string; label: string }>;
  registerPane: (pane: SplitPaneRuntime) => () => void;
}

export const splitViewKey = Symbol('larose-split-view');

export function setSplitViewContext(value: SplitViewContextValue): void {
  setContext(splitViewKey, value);
}

export function getSplitViewContext(): SplitViewContextValue {
  const ctx = getContext<SplitViewContextValue | undefined>(splitViewKey);
  if (!ctx) throw new Error('useSplitView must be used within SplitView');
  return ctx;
}
