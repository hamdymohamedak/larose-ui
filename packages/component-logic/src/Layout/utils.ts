import type { ColumnViewNode } from './types';

export function formatBoxTitle(title: string, settingsStyle = false): string {
  const trimmed = title.trim();
  if (!settingsStyle) return trimmed.replace(/[.:;!?]+$/, '');
  return trimmed.endsWith(':') ? trimmed : `${trimmed}:`;
}

export function getNodesAtPath(root: ColumnViewNode[], path: string[]): ColumnViewNode[] {
  if (path.length === 0) return root;
  let nodes = root;
  for (const id of path) {
    const node = nodes.find((entry) => entry.id === id);
    if (!node?.children) return [];
    nodes = node.children;
  }
  return nodes;
}

export function findNodeByPath(root: ColumnViewNode[], path: string[]): ColumnViewNode | undefined {
  if (path.length === 0) return undefined;
  let nodes = root;
  let current: ColumnViewNode | undefined;
  for (const id of path) {
    current = nodes.find((entry) => entry.id === id);
    if (!current) return undefined;
    nodes = current.children ?? [];
  }
  return current;
}

export function hasChildren(node: ColumnViewNode): boolean {
  return Boolean(node.children?.length);
}
