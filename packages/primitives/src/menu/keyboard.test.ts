import { describe, expect, it } from 'vitest';
import {
  createInitialMenuKeyboardState,
  handleMenuKeyboard,
} from './keyboard';

describe('handleMenuKeyboard', () => {
  const entries = [
    { id: 'save', label: 'Save', accelerator: { mod: true, key: 's' } },
    { id: 'close', label: 'Close', type: 'item' as const },
  ];

  it('selects item on accelerator match', () => {
    const result = handleMenuKeyboard(
      { key: 's', metaKey: true, ctrlKey: false, altKey: false },
      createInitialMenuKeyboardState(),
      { entries, activeSubmenuId: null, platform: 'macos' },
    );

    expect(result.action.type).toBe('select');
    if (result.action.type === 'select') {
      expect(result.action.item.id).toBe('save');
    }
    expect(result.preventDefault).toBe(true);
  });

  it('highlights type-ahead matches', () => {
    const result = handleMenuKeyboard(
      { key: 'c' },
      createInitialMenuKeyboardState(),
      { entries, activeSubmenuId: null, enableTypeAhead: true },
    );

    expect(result.action.type).toBe('highlight');
    expect(result.state.typeAheadHighlightId).toBe('close');
  });

  it('closes on Escape', () => {
    const result = handleMenuKeyboard(
      { key: 'Escape' },
      createInitialMenuKeyboardState(),
      { entries, activeSubmenuId: null },
    );

    expect(result.action.type).toBe('close');
  });
});
