import { describe, expect, it } from 'vitest';
import { buildDockMenuEntries, resolveDockMenuPosition, windowToMenuEntry } from './utils';

describe('DockMenu utils', () => {
  it('maps windows to menu entries', () => {
    expect(windowToMenuEntry({ id: '1', title: 'Inbox' })).toMatchObject({ label: 'Inbox' });
  });

  it('builds running menu with windows then actions', () => {
    const entries = buildDockMenuEntries({
      isRunning: true,
      openWindows: [{ id: '1', title: 'Apple' }],
      runningEntries: [{ id: 'new', label: 'New Window' }],
    });
    expect(entries[0]).toMatchObject({ label: 'Apple' });
    expect(entries.at(-1)).toMatchObject({ label: 'New Window' });
  });

  it('uses closed entries when app is not running', () => {
    const entries = buildDockMenuEntries({
      isRunning: false,
      closedEntries: [{ id: 'open', label: 'Open' }],
    });
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ label: 'Open' });
  });

  it('positions menu above dock icon', () => {
    const pos = resolveDockMenuPosition(new DOMRect(100, 800, 52, 52), 200, 160, 1200);
    expect(pos.y).toBeLessThan(800);
  });
});
