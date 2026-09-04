import { describe, expect, it, vi } from 'vitest';
import { activateOverlayFocus, handleEscapeKey, handleTabKeyTrap } from './focusTrap';

describe('activateOverlayFocus', () => {
  it('traps tab and restores focus on cleanup', () => {
    const root = document.createElement('div');
    const first = document.createElement('button');
    const last = document.createElement('button');
    first.textContent = 'a';
    last.textContent = 'b';
    root.append(first, last);
    document.body.append(root);

    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();

    const onEscape = vi.fn();
    const deactivate = activateOverlayFocus({
      container: root,
      onEscape,
    });

    expect(document.activeElement).toBe(first);

    last.focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    expect(handleTabKeyTrap(tab, root)).toBe(true);

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    expect(handleEscapeKey(escape, onEscape)).toBe(true);
    expect(onEscape).toHaveBeenCalledOnce();

    deactivate();
    expect(document.activeElement).toBe(outside);

    root.remove();
    outside.remove();
  });
});
