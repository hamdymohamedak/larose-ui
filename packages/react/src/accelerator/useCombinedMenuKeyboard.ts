import { useCallback, useRef, useState } from 'react';
import { isAltMnemonicEvent, shouldHandleShortcut } from '@larose-ui/core';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { collectMenuMnemonicBindings } from './mnemonic';
import {
  createInitialTypeAheadState,
  stepTypeAhead,
  type TypeAheadState,
} from './typeAhead';
import { collectTypeAheadItems } from './collectTypeAheadItems';
import { useMenuKeyboardShortcuts, type UseMenuKeyboardShortcutsOptions } from './useMenuKeyboardShortcuts';

export interface UseCombinedMenuKeyboardOptions extends UseMenuKeyboardShortcutsOptions {
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
  /** When true, Alt+letter activates mnemonic items (Windows/Linux). */
  mnemonicActive?: boolean;
}

export interface CombinedMenuKeyboardResult {
  handler: (event: KeyboardEvent) => boolean;
  typeAheadHighlightId: string | null;
  resetTypeAhead: () => void;
}

/**
 * Combines accelerator matching, type-ahead, and mnemonic activation for open menus.
 */
export function useCombinedMenuKeyboard({
  enableTypeAhead = true,
  enableMnemonics = true,
  mnemonicActive = false,
  ...shortcutOptions
}: UseCombinedMenuKeyboardOptions): CombinedMenuKeyboardResult {
  const [typeAheadHighlightId, setTypeAheadHighlightId] = useState<string | null>(null);
  const typeAheadRef = useRef<TypeAheadState>(createInitialTypeAheadState());

  const resetTypeAhead = useCallback(() => {
    typeAheadRef.current = createInitialTypeAheadState();
    setTypeAheadHighlightId(null);
  }, []);

  const handleShortcut = useMenuKeyboardShortcuts(shortcutOptions);

  const handler = useCallback(
    (event: KeyboardEvent): boolean => {
      if (handleShortcut(event)) {
        resetTypeAhead();
        return true;
      }

      if (!shouldHandleShortcut({ target: event.target })) {
        return false;
      }

      const { entries, activeSubmenuId, onSelect } = shortcutOptions;

      // Mnemonic: Alt + letter selects item (Windows/Linux convention)
      if (enableMnemonics && mnemonicActive && isAltMnemonicEvent(event)) {
        const key = event.key.toLowerCase();
        const binding = collectMenuMnemonicBindings(entries, activeSubmenuId).find(
          (entry) => entry.mnemonicKey === key,
        );
        if (binding && !binding.item.disabled) {
          event.preventDefault();
          event.stopPropagation();
          binding.item.onSelect?.();
          onSelect(binding.item);
          resetTypeAhead();
          return true;
        }
      }

      // Enter activates type-ahead highlight
      if (enableTypeAhead && event.key === 'Enter' && typeAheadHighlightId) {
        const items = collectTypeAheadItems(entries, activeSubmenuId);
        const highlighted = items.find((item) => item.id === typeAheadHighlightId);
        if (highlighted && !highlighted.disabled) {
          event.preventDefault();
          event.stopPropagation();
          highlighted.onSelect?.();
          onSelect(highlighted);
          resetTypeAhead();
          return true;
        }
      }

      // Type-ahead: printable character without modifiers
      if (
        enableTypeAhead &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        event.key.length === 1 &&
        /[\p{L}\p{N}]/u.test(event.key)
      ) {
        const items = collectTypeAheadItems(entries, activeSubmenuId);
        const result = stepTypeAhead(typeAheadRef.current, event.key, items);
        typeAheadRef.current = result.state;

        if (result.highlightedId) {
          event.preventDefault();
          event.stopPropagation();
          setTypeAheadHighlightId(result.highlightedId);
          return true;
        }
      }

      return false;
    },
    [
      enableMnemonics,
      enableTypeAhead,
      handleShortcut,
      mnemonicActive,
      resetTypeAhead,
      shortcutOptions.entries,
      shortcutOptions.activeSubmenuId,
      shortcutOptions.onSelect,
      typeAheadHighlightId,
    ],
  );

  return { handler, typeAheadHighlightId, resetTypeAhead };
}

export type { MenuEntry, MenuItemConfig };
