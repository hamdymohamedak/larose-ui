import { describe, expect, it, vi } from 'vitest';
import {
  buildStandardMenuBar,
  resolveDynamicMenuEntries,
  validateMenuBarOrder,
} from './utils';
import { isMenuItem } from '../Menu/utils';

describe('MenuBar utils', () => {
  it('resolves alternate labels when Option is held', () => {
    const resolved = resolveDynamicMenuEntries(
      [
        {
          id: 'close',
          label: 'Close',
          alternateLabel: 'Close All',
        },
      ],
      { optionKey: true },
    );

    expect(resolved[0]).toMatchObject({ label: 'Close All' });
  });

  it('keeps primary label when Option is not held', () => {
    const resolved = resolveDynamicMenuEntries(
      [{ id: 'close', label: 'Close', alternateLabel: 'Close All' }],
      { optionKey: false },
    );

    expect(resolved[0]).toMatchObject({ label: 'Close' });
  });

  it('builds menus in standard HIG order', () => {
    const menus = buildStandardMenuBar({
      appName: 'Safari',
      appSpecificMenus: [{ id: 'history', title: 'History', entries: [] }],
    });

    expect(menus.map((menu) => menu.id)).toEqual([
      'app',
      'file',
      'edit',
      'format',
      'view',
      'history',
      'window',
      'help',
    ]);
    expect(menus[0]?.emphasized).toBe(true);
  });

  it('keeps edit actions visible but disabled when unavailable', () => {
    const menus = buildStandardMenuBar({
      appName: 'Notes',
      context: { canUndo: false, hasSelection: false, canPaste: false },
    });
    const edit = menus.find((menu) => menu.id === 'edit');
    const undo = edit?.entries.find((entry) => isMenuItem(entry) && entry.id === 'undo');
    const copy = edit?.entries.find((entry) => isMenuItem(entry) && entry.id === 'copy');

    expect(undo).toMatchObject({ label: 'Undo', disabled: true });
    expect(copy).toMatchObject({ label: 'Copy', disabled: true });
  });

  it('warns when Help is not last', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    validateMenuBarOrder([
      { id: 'help', title: 'Help', entries: [] },
      { id: 'file', title: 'File', entries: [] },
    ]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
