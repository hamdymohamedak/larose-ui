import { describe, expect, it, vi } from 'vitest';
import {
  FOCUSABLE_SELECTOR,
  getFocusableElements,
  handleEscapeKey,
  handleTabKeyTrap,
} from './focusTrap';
import {
  createTabIds,
  getAdjacentValue,
  getTabValuesFromList,
  handleTabListKeyDown,
} from './tabs';
import { nextDisclosureOpen, resolveDisclosureOpen } from './disclosure';
import { clearSelection, isSelected, selectOnly, toggleSelection } from './selection';

describe('focusTrap', () => {
  it('exports a focusable selector', () => {
    expect(FOCUSABLE_SELECTOR).toContain('button');
  });

  it('handleEscapeKey invokes callback only for Escape', () => {
    const onEscape = vi.fn();
    expect(handleEscapeKey({ key: 'Enter' } as KeyboardEvent, onEscape)).toBe(false);
    expect(onEscape).not.toHaveBeenCalled();
    expect(handleEscapeKey({ key: 'Escape' } as KeyboardEvent, onEscape)).toBe(true);
    expect(onEscape).toHaveBeenCalledOnce();
  });

  it('getFocusableElements returns empty for empty container', () => {
    const root = document.createElement('div');
    expect(getFocusableElements(root)).toEqual([]);
  });

  it('handleTabKeyTrap no-ops without focusable children', () => {
    const root = document.createElement('div');
    const event = { key: 'Tab', preventDefault: vi.fn() } as unknown as KeyboardEvent;
    expect(handleTabKeyTrap(event, root)).toBe(false);
  });
});

describe('tabs', () => {
  it('createTabIds builds stable ids', () => {
    expect(createTabIds('base', 'home')).toEqual({
      tabId: 'base-tab-home',
      panelId: 'base-panel-home',
    });
  });

  it('getAdjacentValue wraps around', () => {
    const values = ['a', 'b', 'c'];
    expect(getAdjacentValue(values, 'a', 1)).toBe('b');
    expect(getAdjacentValue(values, 'c', 1)).toBe('a');
    expect(getAdjacentValue(values, 'a', -1)).toBe('c');
  });

  it('handleTabListKeyDown moves with arrows', () => {
    const list = document.createElement('div');
    list.setAttribute('role', 'tablist');
    for (const value of ['a', 'b', 'c']) {
      const tab = document.createElement('button');
      tab.setAttribute('role', 'tab');
      tab.dataset.value = value;
      list.append(tab);
    }
    expect(getTabValuesFromList(list)).toEqual(['a', 'b', 'c']);

    const onValueChange = vi.fn();
    const event = {
      key: 'ArrowRight',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    expect(handleTabListKeyDown(event, list, { activeValue: 'a', onValueChange })).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

describe('disclosure', () => {
  it('resolves controlled open', () => {
    expect(resolveDisclosureOpen({ open: true, internalOpen: false })).toBe(true);
    expect(resolveDisclosureOpen({ open: false, internalOpen: true })).toBe(false);
  });

  it('toggles when next is omitted', () => {
    expect(nextDisclosureOpen(false)).toBe(true);
    expect(nextDisclosureOpen(true, false)).toBe(false);
  });
});

describe('selection', () => {
  it('toggles multi selection', () => {
    expect(toggleSelection([], 'a')).toEqual(['a']);
    expect(toggleSelection(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleSelection(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('supports single selection', () => {
    expect(toggleSelection(['a'], 'b', 'single')).toEqual(['b']);
    expect(toggleSelection(['b'], 'b', 'single')).toEqual([]);
  });

  it('selectOnly and clearSelection', () => {
    expect(selectOnly('x')).toEqual(['x']);
    expect(clearSelection()).toEqual([]);
    expect(isSelected(['x'], 'x')).toBe(true);
  });
});
