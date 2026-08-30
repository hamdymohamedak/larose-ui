import { describe, expect, it } from 'vitest';
import { findNodeByPath, formatBoxTitle, getNodesAtPath, hasChildren } from './utils';

const tree = [
  {
    id: 'root',
    label: 'Documents',
    children: [
      { id: 'work', label: 'Work', children: [{ id: 'report', label: 'Report.pdf' }] },
      { id: 'personal', label: 'Personal' },
    ],
  },
];

describe('Layout utils', () => {
  it('formats box titles', () => {
    expect(formatBoxTitle('Account settings')).toBe('Account settings');
    expect(formatBoxTitle('Notifications:', true)).toBe('Notifications:');
  });

  it('walks column view paths', () => {
    expect(getNodesAtPath(tree, []).map((node) => node.id)).toEqual(['root']);
    expect(getNodesAtPath(tree, ['root']).map((node) => node.id)).toEqual(['work', 'personal']);
    expect(findNodeByPath(tree, ['root', 'work'])?.label).toBe('Work');
  });

  it('detects nested children', () => {
    expect(hasChildren(tree[0]!)).toBe(true);
    expect(hasChildren({ id: 'x', label: 'Leaf' })).toBe(false);
  });
});
