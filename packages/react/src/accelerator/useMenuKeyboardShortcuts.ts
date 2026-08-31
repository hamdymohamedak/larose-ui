import { useCallback } from 'react';
import {
  handleMenuKeyboard,
  createInitialMenuKeyboardState,
  resolveAcceleratorPlatform,
} from '@larose-ui/primitives';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';

export interface UseMenuKeyboardShortcutsOptions {
  entries: MenuEntry[];
  activeSubmenuId: string | null;
  optionKey?: boolean;
  platform?: ReturnType<typeof resolveAcceleratorPlatform>;
  onSelect: (item: MenuItemConfig) => void;
  onClose: () => void;
}

/**
 * Returns a keydown handler for menu-local accelerator activation.
 * Attach via {@link useMenuAcceleratorRegistration} or directly in MenuPanel.
 */
export function useMenuKeyboardShortcuts({
  entries,
  activeSubmenuId,
  optionKey = false,
  platform,
  onSelect,
  onClose,
}: UseMenuKeyboardShortcutsOptions) {
  const resolvedPlatform = platform ?? resolveAcceleratorPlatform();

  return useCallback(
    (event: KeyboardEvent): boolean => {
      const result = handleMenuKeyboard(
        event,
        createInitialMenuKeyboardState(),
        {
          entries,
          activeSubmenuId,
          optionKey,
          platform: resolvedPlatform,
          enableTypeAhead: false,
          enableMnemonics: false,
        },
      );

      if (result.action.type === 'close') {
        onClose();
        return false;
      }

      if (result.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (result.action.type === 'select') {
        result.action.item.onSelect?.();
        onSelect(result.action.item);
        return true;
      }

      return result.preventDefault;
    },
    [activeSubmenuId, entries, onClose, onSelect, optionKey, resolvedPlatform],
  );
}
