import type { MenuEntry } from '../Menu/types';
import { isMenuItem } from '../Menu/utils';
import { collectMenuAccelerators, type MenuAcceleratorBinding } from './collectMenuAccelerators';

/**
 * Collect top-level menu item accelerators for global MenuBar registration.
 * Submenu items are excluded — they only activate when their submenu is open.
 */
export function collectGlobalMenuAccelerators(
  entries: MenuEntry[],
  options: { optionKey?: boolean } = {},
): MenuAcceleratorBinding[] {
  return collectMenuAccelerators(entries, null, options).filter((binding) =>
    isTopLevelItem(entries, binding.item.id),
  );
}

function isTopLevelItem(entries: MenuEntry[], itemId: string): boolean {
  return entries.some((entry) => isMenuItem(entry) && entry.id === itemId);
}
