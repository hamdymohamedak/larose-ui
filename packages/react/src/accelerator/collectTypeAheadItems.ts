import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { isMenuItem, isMenuSubmenu } from '../Menu/utils';

/**
 * Collect selectable items visible in the current menu context for type-ahead.
 */
export function collectTypeAheadItems(
  entries: MenuEntry[],
  activeSubmenuId: string | null,
): MenuItemConfig[] {
  const items: MenuItemConfig[] = [];

  for (const entry of entries) {
    if (isMenuSubmenu(entry)) {
      if (entry.disabled || entry.hidden) continue;
      if (activeSubmenuId === entry.id) {
        for (const item of entry.items) {
          addTypeAheadItem(items, item);
        }
      }
      continue;
    }

    if (isMenuItem(entry)) {
      addTypeAheadItem(items, entry);
    }
  }

  return items;
}

function addTypeAheadItem(items: MenuItemConfig[], item: MenuItemConfig): void {
  if (item.disabled || item.hidden) return;
  items.push(item);
}
