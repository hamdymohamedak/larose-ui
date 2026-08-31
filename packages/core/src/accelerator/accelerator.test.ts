/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import {
  STANDARD_ACCELERATORS,
  STANDARD_SHORTCUTS,
  acceleratorToId,
  createAcceleratorRegistry,
  formatAccelerator,
  formatAriaKeyshortcuts,
  looksLikeShortcutLabel,
  matchKeyboardEvent,
  normalizeAccelerator,
  parseAccelerator,
  shouldHandleShortcut,
} from './index';

function keyEvent(
  init: Partial<KeyboardEvent> & { key: string },
): KeyboardEvent {
  return {
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...init,
  } as KeyboardEvent;
}

describe('normalizeAccelerator', () => {
  it('lowercases letter keys', () => {
    expect(normalizeAccelerator({ mod: true, key: 'S' })).toEqual({ mod: true, key: 's' });
  });
});

describe('parseAccelerator', () => {
  it('parses macOS symbol shortcuts', () => {
    expect(parseAccelerator('⌘S')).toEqual({ mod: true, key: 's' });
    expect(parseAccelerator('⇧⌘Z')).toEqual({ mod: true, shift: true, key: 'z' });
    expect(parseAccelerator('⌥⌘H')).toEqual({ mod: true, alt: true, key: 'h' });
    expect(parseAccelerator('⌘,')).toEqual({ mod: true, key: ',' });
  });

  it('parses Windows-style shortcuts', () => {
    expect(parseAccelerator('Ctrl+S')).toEqual({ mod: true, key: 's' });
    expect(parseAccelerator('Ctrl+Shift+P')).toEqual({ mod: true, shift: true, key: 'p' });
    expect(parseAccelerator('Alt+Ctrl+K')).toEqual({ mod: true, alt: true, key: 'k' });
  });

  it('returns null for plain text labels', () => {
    expect(parseAccelerator('Copy')).toBeNull();
    expect(parseAccelerator('Save')).toBeNull();
  });
});

describe('looksLikeShortcutLabel', () => {
  it('detects macOS glyphs and modifier text', () => {
    expect(looksLikeShortcutLabel('⌘C')).toBe(true);
    expect(looksLikeShortcutLabel('Ctrl+C')).toBe(true);
    expect(looksLikeShortcutLabel('Copy')).toBe(false);
  });
});

describe('matchKeyboardEvent', () => {
  it('matches mod shortcuts on macOS', () => {
    const acc = { mod: true, key: 's' };
    expect(
      matchKeyboardEvent(keyEvent({ key: 's', metaKey: true }), acc, { platform: 'macos' }),
    ).toBe(true);
    expect(
      matchKeyboardEvent(keyEvent({ key: 's', ctrlKey: true }), acc, { platform: 'macos' }),
    ).toBe(false);
  });

  it('matches mod shortcuts on Windows', () => {
    const acc = { mod: true, key: 's' };
    expect(
      matchKeyboardEvent(keyEvent({ key: 's', ctrlKey: true }), acc, { platform: 'windows' }),
    ).toBe(true);
    expect(
      matchKeyboardEvent(keyEvent({ key: 's', metaKey: true }), acc, { platform: 'windows' }),
    ).toBe(false);
  });

  it('matches modifier combinations', () => {
    const acc = { mod: true, shift: true, key: 'z' };
    expect(
      matchKeyboardEvent(
        keyEvent({ key: 'z', metaKey: true, shiftKey: true }),
        acc,
        { platform: 'macos' },
      ),
    ).toBe(true);
  });

  it('is case-insensitive for letter keys', () => {
    const acc = { mod: true, key: 'c' };
    expect(
      matchKeyboardEvent(keyEvent({ key: 'C', metaKey: true }), acc, { platform: 'macos' }),
    ).toBe(true);
  });
});

describe('formatAccelerator', () => {
  it('formats macOS symbols', () => {
    expect(formatAccelerator({ mod: true, key: 's' }, { platform: 'macos' })).toBe('⌘S');
    expect(formatAccelerator({ mod: true, shift: true, key: 'z' }, { platform: 'macos' })).toBe(
      '⇧⌘Z',
    );
  });

  it('formats Windows text modifiers', () => {
    expect(formatAccelerator({ mod: true, key: 's' }, { platform: 'windows' })).toBe('Ctrl+S');
    expect(formatAccelerator({ mod: true, shift: true, key: 'p' }, { platform: 'windows' })).toBe(
      'Ctrl+Shift+P',
    );
  });
});

describe('formatAriaKeyshortcuts', () => {
  it('uses W3C modifier names', () => {
    expect(formatAriaKeyshortcuts({ mod: true, key: 's' })).toBe('Meta+S');
    expect(formatAriaKeyshortcuts({ mod: true, shift: true, key: 'z' })).toBe('Meta+Shift+Z');
  });
});

describe('STANDARD_ACCELERATORS', () => {
  it('generates legacy STANDARD_SHORTCUTS display strings', () => {
    expect(STANDARD_SHORTCUTS.save).toBe('⌘S');
    expect(STANDARD_SHORTCUTS.copy).toBe('⌘C');
    expect(STANDARD_ACCELERATORS.save).toEqual({ mod: true, key: 's' });
  });
});

describe('shouldHandleShortcut', () => {
  it('blocks shortcuts in text inputs by default', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    expect(shouldHandleShortcut({ target: input })).toBe(false);
    document.body.removeChild(input);
  });

  it('allows shortcuts in editable targets when configured', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    expect(shouldHandleShortcut({ target: input, allowInEditable: true })).toBe(true);
    document.body.removeChild(input);
  });
});

describe('AcceleratorRegistry', () => {
  it('dispatches matching handlers by scope priority', () => {
    const registry = createAcceleratorRegistry();
    const global = vi.fn();
    const component = vi.fn();

    registry.register({
      id: 'global',
      accelerator: { mod: true, key: 'k' },
      handler: global,
      scope: 'global',
      priority: 0,
    });
    registry.register({
      id: 'component',
      accelerator: { mod: true, key: 'k' },
      handler: component,
      scope: 'component',
      priority: 0,
    });

    const handled = registry.handleEvent(
      keyEvent({ key: 'k', metaKey: true }),
      { platform: 'macos', scopes: ['component', 'global'] },
    );

    expect(handled).toBe(true);
    expect(component).toHaveBeenCalledOnce();
    expect(global).not.toHaveBeenCalled();
  });

  it('detects conflicts in development', () => {
    const registry = createAcceleratorRegistry();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    registry.register({
      id: 'a',
      accelerator: { mod: true, key: 's' },
      handler: vi.fn(),
      scope: 'global',
      priority: 0,
    });
    registry.register({
      id: 'b',
      accelerator: { mod: true, key: 's' },
      handler: vi.fn(),
      scope: 'global',
      priority: 0,
    });

    const conflicts = registry.getConflicts();
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0]?.ids).toContain('a');
    expect(conflicts[0]?.ids).toContain('b');
    warn.mockRestore();
  });

  it('uses stable accelerator ids', () => {
    expect(acceleratorToId({ mod: true, shift: true, key: 's' })).toBe('shift+mod+s');
  });
});
