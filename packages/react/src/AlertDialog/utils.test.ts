import { describe, expect, it, vi } from 'vitest';
import {
  orderAlertActions,
  resolveCancelAction,
  shouldStyleDestructive,
  validateAlertActions,
  warnIfAlertTitleTooLong,
} from './utils';

describe('AlertDialog utils', () => {
  it('orders cancel leading and default trailing on desktop', () => {
    const { ordered, layout } = orderAlertActions(
      [
        { id: 'delete', label: 'Delete', role: 'destructive' },
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
        { id: 'save', label: 'Save', role: 'default' },
      ],
      'desktop',
    );
    expect(layout).toBe('row');
    expect(ordered.map((action) => action.id)).toEqual(['cancel', 'delete', 'save']);
  });

  it('stacks buttons on compact with default first and cancel last', () => {
    const { ordered, layout } = orderAlertActions(
      [
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
        { id: 'delete', label: 'Delete', role: 'destructive' },
        { id: 'save', label: 'Save', role: 'default' },
      ],
      'compact',
    );
    expect(layout).toBe('stack');
    expect(ordered.map((action) => action.id)).toEqual(['save', 'delete', 'cancel']);
  });

  it('uses a horizontal row for two compact actions', () => {
    const { ordered, layout } = orderAlertActions(
      [
        { id: 'delete', label: 'Delete', role: 'destructive' },
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
      ],
      'compact',
    );
    expect(layout).toBe('row');
    expect(ordered.map((action) => action.id)).toEqual(['cancel', 'delete']);
  });

  it('skips destructive styling for deliberate actions', () => {
    expect(
      shouldStyleDestructive({ id: 'empty', label: 'Empty Trash', role: 'destructive', deliberate: true }),
    ).toBe(false);
    expect(
      shouldStyleDestructive({ id: 'delete', label: 'Delete', role: 'destructive' }),
    ).toBe(true);
  });

  it('warns about unhelpful titles', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfAlertTitleTooLong('Error');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns when destructive actions lack cancel', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    validateAlertActions([{ id: 'delete', label: 'Delete', role: 'destructive' }]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('finds cancel action', () => {
    expect(
      resolveCancelAction([{ id: 'cancel', label: 'Cancel', role: 'cancel' }])?.label,
    ).toBe('Cancel');
  });
});
