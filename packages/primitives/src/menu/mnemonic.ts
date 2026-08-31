import { resolveMnemonicKey, stripMnemonicMarker } from '@larose-ui/core';
import type { MenuBarMenuConfig, MenuEntry, MenuItemConfig } from './types';
import { isMenuItem, isMenuSubmenu } from './utils';

export interface MenuMnemonicBinding {
  item: MenuItemConfig;
  mnemonicKey: string;
}

export interface MenuBarMnemonicBinding {
  menuId: string;
  mnemonicKey: string;
}

export function collectMenuMnemonicBindings(
  entries: MenuEntry[],
  activeSubmenuId: string | null,
): MenuMnemonicBinding[] {
  const bindings: MenuMnemonicBinding[] = [];

  for (const entry of entries) {
    if (isMenuSubmenu(entry)) {
      if (entry.disabled || entry.hidden) continue;
      if (activeSubmenuId === entry.id) {
        for (const item of entry.items) {
          addMnemonicBinding(bindings, item);
        }
      }
      continue;
    }

    if (isMenuItem(entry)) {
      addMnemonicBinding(bindings, entry);
    }
  }

  return bindings;
}

function addMnemonicBinding(bindings: MenuMnemonicBinding[], item: MenuItemConfig): void {
  if (item.disabled || item.hidden) return;
  const mnemonicKey = resolveMnemonicKey(item.label, item.mnemonic);
  if (!mnemonicKey) return;
  bindings.push({ item, mnemonicKey });
}

export function collectMenuBarMnemonicBindings(
  menus: MenuBarMenuConfig[],
): MenuBarMnemonicBinding[] {
  return menus
    .map((menu) => ({
      menuId: menu.id,
      mnemonicKey: resolveMnemonicKey(menu.title, menu.mnemonic),
    }))
    .filter((entry): entry is MenuBarMnemonicBinding => Boolean(entry.mnemonicKey))
    .map((entry) => ({
      menuId: entry.menuId,
      mnemonicKey: entry.mnemonicKey!,
    }));
}

export { stripMnemonicMarker };
