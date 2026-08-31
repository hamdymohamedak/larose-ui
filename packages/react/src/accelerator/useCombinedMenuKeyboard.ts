import { useCallback, useRef, useState } from 'react';
import {
  createInitialMenuKeyboardState,
  handleMenuKeyboard,
  resetMenuKeyboardState,
  resolveAcceleratorPlatform,
} from '@larose-ui/primitives';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import type { UseMenuKeyboardShortcutsOptions } from './useMenuKeyboardShortcuts';

export interface UseCombinedMenuKeyboardOptions extends UseMenuKeyboardShortcutsOptions {
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
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
  entries,
  activeSubmenuId,
  optionKey,
  platform,
  onSelect,
  onClose,
}: UseCombinedMenuKeyboardOptions): CombinedMenuKeyboardResult {
  const [typeAheadHighlightId, setTypeAheadHighlightId] = useState<string | null>(null);
  const keyboardStateRef = useRef(createInitialMenuKeyboardState());

  const resetTypeAhead = useCallback(() => {
    keyboardStateRef.current = resetMenuKeyboardState(keyboardStateRef.current);
    setTypeAheadHighlightId(null);
  }, []);

  const handler = useCallback(
    (event: KeyboardEvent): boolean => {
      const result = handleMenuKeyboard(event, keyboardStateRef.current, {
        entries,
        activeSubmenuId,
        optionKey,
        platform: platform ?? resolveAcceleratorPlatform(),
        enableTypeAhead,
        enableMnemonics,
        mnemonicActive,
      });

      keyboardStateRef.current = result.state;
      setTypeAheadHighlightId(result.state.typeAheadHighlightId);

      if (result.action.type === 'close') {
        onClose();
        return false;
      }

      if (result.preventDefault) {
        event.preventDefault();
      }
      if (result.stopPropagation) {
        event.stopPropagation();
      }

      if (result.action.type === 'select') {
        result.action.item.onSelect?.();
        onSelect(result.action.item);
        return true;
      }

      return result.preventDefault;
    },
    [
      activeSubmenuId,
      enableMnemonics,
      enableTypeAhead,
      entries,
      mnemonicActive,
      onClose,
      onSelect,
      optionKey,
      platform,
    ],
  );

  return { handler, typeAheadHighlightId, resetTypeAhead };
}

export type { MenuEntry, MenuItemConfig };
