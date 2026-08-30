import type { OutlineColumn, OutlineNode, SortDirection } from './types';

export function formatColumnHeader(header: string): string {
  return header.trim().replace(/[.:;!?]+$/, '');
}

export function truncateMiddle(text: string, maxLength = 32): string {
  if (text.length <= maxLength) return text;
  const keep = Math.floor((maxLength - 1) / 2);
  return `${text.slice(0, keep)}…${text.slice(text.length - keep)}`;
}

export function nextSortDirection(
  currentKey: string,
  columnKey: string,
  direction: SortDirection,
): SortDirection {
  if (currentKey !== columnKey) return 'asc';
  return direction === 'asc' ? 'desc' : 'asc';
}

export function sortRows<T>(rows: T[], accessor: (row: T) => string, direction: SortDirection): T[] {
  const sorted = [...rows].sort((a, b) => accessor(a).localeCompare(accessor(b)));
  return direction === 'asc' ? sorted : sorted.reverse();
}

export function flattenOutline(
  nodes: OutlineNode[],
  expanded: Set<string>,
  depth = 0,
): Array<{ node: OutlineNode; depth: number }> {
  const result: Array<{ node: OutlineNode; depth: number }> = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.children?.length && expanded.has(node.id)) {
      result.push(...flattenOutline(node.children, expanded, depth + 1));
    }
  }
  return result;
}

export function sortOutlineNodes(
  nodes: OutlineNode[],
  sortKey: string,
  direction: SortDirection,
): OutlineNode[] {
  const accessor = (node: OutlineNode) =>
    sortKey === 'label' ? node.label : (node.values?.[sortKey] ?? '');

  const sorted = sortRows(nodes, accessor, direction);
  return sorted.map((node) => ({
    ...node,
    children: node.children?.length
      ? sortOutlineNodes(node.children, sortKey, direction)
      : node.children,
  }));
}

/** IDs of a node and every expandable descendant (Option-click expand all). */
export function collectExpandableSubtree(node: OutlineNode): string[] {
  if (!node.children?.length) return [];
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...collectExpandableSubtree(child));
  }
  return ids;
}

export function collectAllExpandableIds(nodes: OutlineNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children?.length) {
      ids.push(node.id, ...collectAllExpandableIds(node.children));
    }
  }
  return ids;
}

export function filterOutline(nodes: OutlineNode[], query: string): OutlineNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return nodes;

  function filterNode(node: OutlineNode): OutlineNode | null {
    const labelMatch = node.label.toLowerCase().includes(normalized);
    const valueMatch = Object.values(node.values ?? {}).some((value) =>
      value.toLowerCase().includes(normalized),
    );
    const filteredChildren = (node.children ?? [])
      .map(filterNode)
      .filter((entry): entry is OutlineNode => entry !== null);

    if (labelMatch || valueMatch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    }
    return null;
  }

  return nodes.map(filterNode).filter((entry): entry is OutlineNode => entry !== null);
}

export function normalizeOutlineColumns(
  columns: Array<string | OutlineColumn> | undefined,
): OutlineColumn[] {
  return (columns ?? ['Kind', 'Size']).map((column) =>
    typeof column === 'string'
      ? { key: column, header: column, sortable: true }
      : {
          key: column.key,
          header: column.header,
          sortable: column.sortable ?? true,
          width: column.width,
        },
  );
}
