import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_SYSTEM_QUICK_ACTIONS, prepareQuickActions } from './utils';

describe('QuickActions utils', () => {
  it('limits app actions to four', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const actions = prepareQuickActions([
      { id: '1', label: 'One' },
      { id: '2', label: 'Two' },
      { id: '3', label: 'Three' },
      { id: '4', label: 'Four' },
      { id: '5', label: 'Five' },
    ], { includeSystemActions: false });
    expect(actions).toHaveLength(4);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('appends system actions after app actions', () => {
    const actions = prepareQuickActions([{ id: 'inbox', label: 'Open Inbox' }]);
    expect(actions[0]).toMatchObject({ label: 'Open Inbox' });
    expect(actions.at(-1)).toMatchObject({ label: 'Edit Home Screen', system: true });
    expect(actions).toContainEqual(expect.objectContaining({ label: 'Remove App' }));
  });

  it('uses custom system actions when provided', () => {
    const actions = prepareQuickActions([], {
      systemActions: [{ id: 'custom', label: 'Custom System', system: true }],
    });
    expect(actions).toHaveLength(1);
  });
});

describe('DEFAULT_SYSTEM_QUICK_ACTIONS', () => {
  it('includes remove and edit actions', () => {
    expect(DEFAULT_SYSTEM_QUICK_ACTIONS.map((a) => a.label)).toEqual([
      'Remove App',
      'Edit Home Screen',
    ]);
  });
});
