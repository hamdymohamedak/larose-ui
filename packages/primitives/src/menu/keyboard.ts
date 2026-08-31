import {
  isAltMnemonicEvent,
  matchKeyboardEvent,
  shouldHandleShortcut,
  type AcceleratorPlatform,
} from '@larose-ui/core';
import { collectMenuAccelerators } from './collectAccelerators';
import { collectTypeAheadItems } from './collectTypeAheadItems';
import { collectMenuMnemonicBindings } from './mnemonic';
import {
  createInitialTypeAheadState,
  stepTypeAhead,
  type TypeAheadState,
} from './typeAhead';
import type { MenuEntry, MenuItemConfig } from './types';
import { resolveAcceleratorPlatform } from './resolveShortcut';

export interface MenuKeyboardEvent {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  target?: EventTarget | null;
}

function asKeyboardEvent(event: MenuKeyboardEvent): KeyboardEvent {
  return {
    key: event.key,
    metaKey: event.metaKey ?? false,
    ctrlKey: event.ctrlKey ?? false,
    altKey: event.altKey ?? false,
    shiftKey: event.shiftKey ?? false,
  } as KeyboardEvent;
}

export interface MenuKeyboardContext {
  entries: MenuEntry[];
  activeSubmenuId: string | null;
  optionKey?: boolean;
  platform?: AcceleratorPlatform;
  enableTypeAhead?: boolean;
  enableMnemonics?: boolean;
  mnemonicActive?: boolean;
}

export interface MenuKeyboardState {
  typeAhead: TypeAheadState;
  typeAheadHighlightId: string | null;
}

export type MenuKeyboardAction =
  | { type: 'none' }
  | { type: 'close' }
  | { type: 'select'; item: MenuItemConfig }
  | { type: 'highlight'; itemId: string };

export interface MenuKeyboardResult {
  state: MenuKeyboardState;
  action: MenuKeyboardAction;
  preventDefault: boolean;
  stopPropagation: boolean;
}

export function createInitialMenuKeyboardState(): MenuKeyboardState {
  return {
    typeAhead: createInitialTypeAheadState(),
    typeAheadHighlightId: null,
  };
}

export function resetMenuKeyboardState(state: MenuKeyboardState): MenuKeyboardState {
  return createInitialMenuKeyboardState();
}

/**
 * Headless menu keyboard handler — accelerators, type-ahead, mnemonics, Enter activation.
 * Framework bindings attach DOM listeners and invoke item.onSelect from `select` actions.
 */
export function handleMenuKeyboard(
  event: MenuKeyboardEvent,
  state: MenuKeyboardState,
  context: MenuKeyboardContext,
): MenuKeyboardResult {
  const {
    entries,
    activeSubmenuId,
    optionKey = false,
    platform = resolveAcceleratorPlatform(),
    enableTypeAhead = true,
    enableMnemonics = true,
    mnemonicActive = false,
  } = context;

  const noop = (nextState: MenuKeyboardState): MenuKeyboardResult => ({
    state: nextState,
    action: { type: 'none' },
    preventDefault: false,
    stopPropagation: false,
  });

  const keyboardEvent = asKeyboardEvent(event);

  if (event.key === 'Escape') {
    return {
      state: resetMenuKeyboardState(state),
      action: { type: 'close' },
      preventDefault: false,
      stopPropagation: false,
    };
  }

  if (!shouldHandleShortcut({ target: event.target ?? null })) {
    return noop(state);
  }

  const bindings = collectMenuAccelerators(entries, activeSubmenuId, { optionKey });
  for (const binding of bindings) {
    if (matchKeyboardEvent(keyboardEvent, binding.accelerator, { platform })) {
      if (binding.item.disabled) {
        return {
          state: resetMenuKeyboardState(state),
          action: { type: 'none' },
          preventDefault: true,
          stopPropagation: true,
        };
      }
      return {
        state: resetMenuKeyboardState(state),
        action: { type: 'select', item: binding.item },
        preventDefault: true,
        stopPropagation: true,
      };
    }
  }

  if (enableMnemonics && mnemonicActive && isAltMnemonicEvent(keyboardEvent)) {
    const key = event.key.toLowerCase();
    const binding = collectMenuMnemonicBindings(entries, activeSubmenuId).find(
      (entry) => entry.mnemonicKey === key,
    );
    if (binding && !binding.item.disabled) {
      return {
        state: resetMenuKeyboardState(state),
        action: { type: 'select', item: binding.item },
        preventDefault: true,
        stopPropagation: true,
      };
    }
  }

  if (enableTypeAhead && event.key === 'Enter' && state.typeAheadHighlightId) {
    const items = collectTypeAheadItems(entries, activeSubmenuId);
    const highlighted = items.find((item) => item.id === state.typeAheadHighlightId);
    if (highlighted && !highlighted.disabled) {
      return {
        state: resetMenuKeyboardState(state),
        action: { type: 'select', item: highlighted },
        preventDefault: true,
        stopPropagation: true,
      };
    }
  }

  if (
    enableTypeAhead &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    event.key.length === 1 &&
    /[\p{L}\p{N}]/u.test(event.key)
  ) {
    const items = collectTypeAheadItems(entries, activeSubmenuId);
    const result = stepTypeAhead(state.typeAhead, event.key, items);
    if (result.highlightedId) {
      return {
        state: {
          typeAhead: result.state,
          typeAheadHighlightId: result.highlightedId,
        },
        action: { type: 'highlight', itemId: result.highlightedId },
        preventDefault: true,
        stopPropagation: true,
      };
    }
  }

  return noop(state);
}
