import { describe, expect, it, vi } from 'vitest';
import type { ContextMenuEntry } from './types';
import {
  countContextMenuGroups,
  filterContextMenuEntries,
  formatContextMenuTitle,
  orderContextMenuEntries,
  prepareContextMenuEntries,
  warnIfTooManyGroups,
} from './utils';

const sample: ContextMenuEntry[] = [
  { id: 'reply', label: 'Reply', type: 'item' },
  { id: 'move', label: 'Move', type: 'item', hidden: true },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', type: 'item', destructive: true },
  { id: 'archive', label: 'Archive', type: 'item' },
];

describe('ContextMenu utils', () => {
  it('formats multi-select titles', () => {
    expect(formatContextMenuTitle(3, 'Message')).toBe('3 Messages');
  });

  it('hides unavailable items', () => {
    const filtered = filterContextMenuEntries(sample);
    expect(filtered.some((entry) => 'id' in entry && entry.id === 'move')).toBe(false);
  });

  it('places destructive items last in a group', () => {
    const ordered = orderContextMenuEntries([
      { id: 'delete', label: 'Delete', destructive: true },
      { id: 'reply', label: 'Reply' },
    ]);
    expect(ordered.at(-1)).toMatchObject({ id: 'delete' });
  });

  it('counts separator groups', () => {
    expect(countContextMenuGroups(sample)).toBe(2);
  });

  it('warns when there are too many groups', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfTooManyGroups([
      { id: 'a', label: 'A' },
      { type: 'separator' },
      { id: 'b', label: 'B' },
      { type: 'separator' },
      { id: 'c', label: 'C' },
      { type: 'separator' },
      { id: 'd', label: 'D' },
    ]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('prepares filtered and ordered entries', () => {
    const prepared = prepareContextMenuEntries(sample);
    expect(prepared.some((entry) => 'id' in entry && entry.id === 'move')).toBe(false);
    expect(prepared.at(-1)).toMatchObject({ id: 'delete' });
  });
});
