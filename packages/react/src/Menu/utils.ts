import {
  MAX_SUBMENU_ITEMS,
  formatMenuLabel,
  isMenuSeparator,
  isMenuSubmenu as primitiveIsMenuSubmenu,
  isMenuItem as primitiveIsMenuItem,
  filterMenuEntries as primitiveFilterMenuEntries,
  orderMenuEntries as primitiveOrderMenuEntries,
  prepareMenuEntries as primitivePrepareMenuEntries,
  splitCompactAndList as primitiveSplitCompactAndList,
  resolveMenuPanelPosition,
} from '@larose-ui/primitives';
import type { MenuEntry, MenuItemConfig, MenuLayout } from './types';

export {
  MAX_SUBMENU_ITEMS,
  formatMenuLabel,
  isMenuSeparator,
  resolveMenuPanelPosition,
};

export function isMenuSubmenu(entry: MenuEntry): entry is Extract<MenuEntry, { type: 'submenu' }> {
  return primitiveIsMenuSubmenu(entry);
}

export function isMenuItem(entry: MenuEntry): entry is MenuItemConfig {
  return primitiveIsMenuItem(entry);
}

export function filterMenuEntries(entries: MenuEntry[]): MenuEntry[] {
  return primitiveFilterMenuEntries(entries);
}

export function orderMenuEntries(entries: MenuEntry[]): MenuEntry[] {
  return primitiveOrderMenuEntries(entries);
}

export function prepareMenuEntries(entries: MenuEntry[]): MenuEntry[] {
  return primitivePrepareMenuEntries(entries);
}

export function splitCompactAndList(
  entries: MenuEntry[],
  layout: MenuLayout,
): { compact: MenuItemConfig[]; list: MenuEntry[] } {
  return primitiveSplitCompactAndList(entries, layout);
}
