import { describe, expect, it, vi } from 'vitest';
import { prepareMenuEntries, splitCompactAndList } from './utils';

describe('Menu utils', () => {
  it('hides unavailable entries', () => {
    const entries = prepareMenuEntries([
      { id: 'keep', label: 'Keep' },
      { id: 'hidden', label: 'Hidden', hidden: true },
    ]);
    expect(entries).toHaveLength(1);
  });

  it('moves destructive items to end of group', () => {
    const entries = prepareMenuEntries([
      { id: 'delete', label: 'Delete', destructive: true },
      { id: 'copy', label: 'Copy' },
    ]);
    expect(entries.map((e) => ('label' in e ? e.label : null))).toEqual(['Copy', 'Delete']);
  });

  it('splits compact row for small layout', () => {
    const entries = prepareMenuEntries([
      { id: 'bold', label: 'Bold', icon: 'B' },
      { id: 'italic', label: 'Italic', icon: 'I' },
      { id: 'underline', label: 'Underline', icon: 'U' },
      { id: 'strike', label: 'Strikethrough', icon: 'S' },
      { id: 'plain', label: 'Plain Text' },
    ]);
    const { compact, list } = splitCompactAndList(entries, 'small');
    expect(compact).toHaveLength(4);
    expect(list.some((entry) => isMenuItem(entry) && entry.label === 'Plain Text')).toBe(true);
  });

  it('splits three compact tiles for medium layout', () => {
    const entries = prepareMenuEntries([
      { id: 'scan', label: 'Scan' },
      { id: 'lock', label: 'Lock' },
      { id: 'pin', label: 'Pin' },
      { id: 'share', label: 'Share' },
    ]);
    const { compact } = splitCompactAndList(entries, 'medium');
    expect(compact).toHaveLength(3);
  });
});

function isMenuItem(entry: { type?: string; label?: string }): entry is { label: string } {
  return entry.type !== 'separator' && entry.type !== 'submenu' && 'label' in entry;
}

describe('submenu warnings', () => {
  it('warns when submenu is too long', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    prepareMenuEntries([
      {
        type: 'submenu',
        id: 'sort',
        label: 'Sort By',
        items: Array.from({ length: 6 }, (_, i) => ({ id: `o${i}`, label: `Option ${i}` })),
      },
    ]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
