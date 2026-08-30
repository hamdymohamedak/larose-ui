import { describe, expect, it } from 'vitest';
import { buildPopUpMenuEntries, resolveDefaultValue, resolvePopUpLabel } from './utils';

describe('PopUpButton utils', () => {
  const options = [
    { value: 'never', label: 'Never' },
    { value: 'daily', label: 'Every Day' },
    { value: 'weekly', label: 'Every Week' },
  ];

  it('resolves label from current value', () => {
    expect(resolvePopUpLabel(options, 'weekly', 'Repeat')).toBe('Every Week');
    expect(resolvePopUpLabel(options, undefined, 'Repeat')).toBe('Repeat');
  });

  it('falls back to first option as default', () => {
    expect(resolveDefaultValue(options)).toBe('never');
    expect(resolveDefaultValue(options, 'daily')).toBe('daily');
  });

  it('builds menu entries with selected state', () => {
    const entries = buildPopUpMenuEntries(options, 'daily');
    expect(entries[1]).toMatchObject({ label: 'Every Day', selected: true });
  });

  it('appends custom option after separator', () => {
    const entries = buildPopUpMenuEntries(options, 'custom', {
      value: 'custom',
      label: 'Custom…',
    });
    expect(entries.at(-1)).toMatchObject({ label: 'Custom…' });
    expect(entries.some((entry) => entry.type === 'separator')).toBe(true);
  });
});
