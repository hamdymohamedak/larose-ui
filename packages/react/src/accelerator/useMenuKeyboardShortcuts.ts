import { useCallback } from 'react';
import { matchKeyboardEvent, shouldHandleShortcut } from '@larose-ui/core';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { collectMenuAccelerators } from './collectMenuAccelerators';
import { resolveAcceleratorPlatform } from './resolveMenuShortcut';

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
      if (event.key === 'Escape') {
        onClose();
        return false;
      }

      if (!shouldHandleShortcut({ target: event.target })) {
        return false;
      }

      const bindings = collectMenuAccelerators(entries, activeSubmenuId, { optionKey });

      for (const binding of bindings) {
        if (matchKeyboardEvent(event, binding.accelerator, { platform: resolvedPlatform })) {
          event.preventDefault();
          event.stopPropagation();
          if (!binding.item.disabled) {
            binding.item.onSelect?.();
            onSelect(binding.item);
          }
          return true;
        }
      }

      return false;
    },
    [activeSubmenuId, entries, onClose, onSelect, optionKey, resolvedPlatform],
  );
}
