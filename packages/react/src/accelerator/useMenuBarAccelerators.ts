import { useEffect, useRef } from 'react';
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuItemConfig } from '../Menu/types';
import type { MenuBarMenuConfig } from '../MenuBar/types';
import { resolveDynamicMenuEntries } from '../MenuBar/utils';
import { useAcceleratorContext } from './AcceleratorProvider';
import { collectGlobalMenuAccelerators } from './collectGlobalMenuAccelerators';

export interface UseMenuBarAcceleratorsOptions {
  menus: MenuBarMenuConfig[];
  optionKey?: boolean;
  /** When false, shortcuts only work while a menu is open. Defaults to true. */
  enableGlobalShortcuts?: boolean;
  onMenuAction?: (menuId: string, entry: MenuItemConfig) => void;
}

/**
 * Registers top-level MenuBar item accelerators globally so ⌘S / Ctrl+S works
 * even when menus are closed. Menu-local handlers take priority while open.
 */
export function useMenuBarAccelerators({
  menus,
  optionKey = false,
  enableGlobalShortcuts = true,
  onMenuAction,
}: UseMenuBarAcceleratorsOptions): void {
  const context = useAcceleratorContext();
  const onMenuActionRef = useRef(onMenuAction);
  onMenuActionRef.current = onMenuAction;

  useEffect(() => {
    if (!context || !enableGlobalShortcuts) return;

    const unregisters: Array<() => void> = [];

    for (const menu of menus) {
      const prepared = resolveDynamicMenuEntries(prepareMenuEntries(menu.entries), {
        optionKey,
      });
      const bindings = collectGlobalMenuAccelerators(prepared, { optionKey });

      for (const binding of bindings) {
        const { item, accelerator } = binding;

        unregisters.push(
          context.registry.register({
            id: `menubar-${menu.id}-${item.id}`,
            accelerator,
            scope: 'component',
            priority: 0,
            enabled: () => !item.disabled && typeof item.onSelect === 'function',
            handler: () => {
              if (item.disabled) return;
              onMenuActionRef.current?.(menu.id, item);
            },
          }),
        );
      }
    }

    return () => {
      for (const unregister of unregisters) unregister();
    };
  }, [context, enableGlobalShortcuts, menus, optionKey]);
}
