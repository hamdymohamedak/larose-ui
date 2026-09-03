import { MAX_TAB_VIEW_TABS } from './types';

export function formatTabLabel(label: string): string {
  return label.trim();
}

export function warnIfTooManyTabs(count: number): void {
  if (count > MAX_TAB_VIEW_TABS) {
    console.warn(
      `TabView supports at most ${MAX_TAB_VIEW_TABS} tabs; consider a pop-up button menu instead.`,
    );
  }
}
