import { describe, expect, it } from 'vitest';
import type { OutlineNode } from './types';
import {
  flattenOutline,
  formatColumnHeader,
  nextSortDirection,
  sortOutlineNodes,
  sortRows,
  filterOutline,
  collectExpandableSubtree,
  truncateMiddle,
} from './utils';

const tree: OutlineNode[] = [
  {
    id: 'a',
    label: 'Alpha',
    values: { Size: '2 MB' },
    children: [{ id: 'b', label: 'Beta', values: { Size: '1 MB' } }],
  },
  { id: 'c', label: 'Charlie', values: { Size: '3 MB' } },
];

describe('ListTable utils', () => {
  it('formats column headers without punctuation', () => {
    expect(formatColumnHeader('Employee Name:')).toBe('Employee Name');
  });

  it('truncates in the middle', () => {
    expect(truncateMiddle('very-long-document-name-final.pdf', 20)).toBe('very-long…final.pdf');
  });

  it('toggles sort direction', () => {
    expect(nextSortDirection('name', 'name', 'asc')).toBe('desc');
    expect(nextSortDirection('role', 'name', 'asc')).toBe('asc');
  });

  it('sorts rows', () => {
    const rows = [{ name: 'Zed' }, { name: 'Ada' }];
    expect(sortRows(rows, (row) => row.name, 'asc').map((row) => row.name)).toEqual(['Ada', 'Zed']);
  });

  it('flattens outline nodes', () => {
    const nodes = [{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] }];
    expect(flattenOutline(nodes, new Set(['a'])).map((entry) => entry.node.id)).toEqual(['a', 'b']);
  });

  it('sorts outline nodes at each hierarchy level', () => {
    const sorted = sortOutlineNodes(tree, 'label', 'asc');
    expect(sorted.map((node) => node.label)).toEqual(['Alpha', 'Charlie']);
    expect(sorted[0]?.children?.map((node) => node.label)).toEqual(['Beta']);
  });

  it('filters outline nodes by query', () => {
    expect(filterOutline(tree, 'beta').map((node) => node.label)).toEqual(['Alpha']);
  });

  it('collects expandable subtree ids', () => {
    const nested: OutlineNode = {
      id: 'a',
      label: 'Alpha',
      children: [{ id: 'b', label: 'Beta', children: [{ id: 'c', label: 'Gamma' }] }],
    };
    expect(collectExpandableSubtree(nested)).toEqual(['a', 'b']);
  });
});
