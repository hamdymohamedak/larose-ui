import { describe, expect, it, vi } from 'vitest';
import {
  countPullDownActions,
  defaultDestructiveConfirmation,
  warnIfTooFewPullDownItems,
} from './utils';

describe('PullDownButton utils', () => {
  it('counts actionable menu entries', () => {
    expect(
      countPullDownActions([
        { id: 'a', label: 'Add Note' },
        { id: 'b', label: 'Add Checklist' },
        { type: 'separator' },
        { id: 'c', label: 'Add Scan' },
      ]),
    ).toBe(3);
  });

  it('warns when fewer than three items are provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfTooFewPullDownItems([
      { id: 'a', label: 'One' },
      { id: 'b', label: 'Two' },
    ]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('builds destructive confirmation copy', () => {
    expect(defaultDestructiveConfirmation('Delete Note')).toMatchObject({
      title: 'Delete Note?',
      confirmLabel: 'Delete Note',
    });
  });
});
