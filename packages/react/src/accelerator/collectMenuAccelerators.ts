import type { Accelerator } from '@larose-ui/core';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { isMenuItem, isMenuSubmenu } from '../Menu/utils';
import { resolveMenuShortcut } from './resolveMenuShortcut';

export interface MenuAcceleratorBinding {
  item: MenuItemConfig;
  accelerator: Accelerator;
}

/**
 * Collect keyboard bindings from visible menu entries respecting submenu context.
 *
 * When a submenu is open, items inside it are included along with top-level items.
 * Items inside closed submenus are excluded.
 */
export function collectMenuAccelerators(
  entries: MenuEntry[],
  activeSubmenuId: string | null,
  options: { optionKey?: boolean } = {},
): MenuAcceleratorBinding[] {
  const bindings: MenuAcceleratorBinding[] = [];

  for (const entry of entries) {
    if (isMenuSubmenu(entry)) {
      if (entry.disabled) continue;

      if (activeSubmenuId === entry.id) {
        for (const item of entry.items) {
          addItemBinding(bindings, item, options);
        }
      }
      continue;
    }

    if (isMenuItem(entry)) {
      addItemBinding(bindings, entry, options);
    }
  }

  return bindings;
}

function addItemBinding(
  bindings: MenuAcceleratorBinding[],
  item: MenuItemConfig,
  options: { optionKey?: boolean },
): void {
  if (item.disabled || item.hidden) return;

  const resolved = resolveMenuShortcut(item, { optionKey: options.optionKey });
  if (!resolved.accelerator) return;

  bindings.push({ item, accelerator: resolved.accelerator });
}
