import type { MenuEntry } from '../Menu/types';
import { isMenuItem, isMenuSubmenu } from '../Menu/utils';

export const MIN_PULLDOWN_ITEMS = 3;

export function countPullDownActions(entries: MenuEntry[]): number {
  let count = 0;
  for (const entry of entries) {
    if (entry.type === 'separator') continue;
    if (isMenuSubmenu(entry)) {
      count += 1;
      continue;
    }
    if (isMenuItem(entry) && !entry.hidden) count += 1;
  }
  return count;
}

export function warnIfTooFewPullDownItems(entries: MenuEntry[]): void {
  const count = countPullDownActions(entries);
  if (count > 0 && count < MIN_PULLDOWN_ITEMS) {
    console.warn(
      `Pull-down buttons work best with at least ${MIN_PULLDOWN_ITEMS} items; found ${count}. Consider using standalone buttons instead.`,
    );
  }
}

export function defaultDestructiveConfirmation(label: string): {
  title: string;
  description: string;
  confirmLabel: string;
} {
  return {
    title: `${label}?`,
    description: 'This action cannot be undone.',
    confirmLabel: label,
  };
}
