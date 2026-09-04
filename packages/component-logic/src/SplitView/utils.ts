import type { SplitPaneConfig } from './types';

export function clampSize(size: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, size));
}

export function resizeAdjacentSizes(
  sizes: number[],
  dividerIndex: number,
  delta: number,
  mins: number[],
  maxes: number[],
): number[] {
  const left = dividerIndex;
  const right = dividerIndex + 1;
  if (left < 0 || right >= sizes.length) return sizes;

  const nextLeft = sizes[left]! + delta;
  const nextRight = sizes[right]! - delta;
  if (nextLeft < mins[left]! || nextRight < mins[right]!) return sizes;
  if (nextLeft > maxes[left]! || nextRight > maxes[right]!) return sizes;

  const next = [...sizes];
  next[left] = nextLeft;
  next[right] = nextRight;
  return next;
}

export function redistributeHiddenPane(
  sizes: number[],
  paneIndex: number,
  visible: boolean[],
): number[] {
  if (visible[paneIndex]) return sizes;

  const next = [...sizes];
  const reclaimed = next[paneIndex] ?? 0;
  next[paneIndex] = 0;

  const visibleIndexes = visible
    .map((isVisible, index) => (isVisible && index !== paneIndex ? index : -1))
    .filter((index) => index >= 0);

  if (visibleIndexes.length === 0) return next;

  const share = reclaimed / visibleIndexes.length;
  for (const index of visibleIndexes) {
    next[index] = (next[index] ?? 0) + share;
  }
  return next;
}

export function defaultSizesFromPanes(panes: SplitPaneConfig[]): number[] {
  const total = panes.reduce((sum, pane) => sum + (pane.defaultVisible ? pane.defaultSize : 0), 0);
  if (total === 0) return panes.map((pane) => pane.defaultSize);

  return panes.map((pane) =>
    pane.defaultVisible ? (pane.defaultSize / total) * 100 : 0,
  );
}

export function parsePaneElement(child: unknown): SplitPaneConfig | null {
  if (
    !child ||
    typeof child !== 'object' ||
    !('type' in child) ||
    !('props' in child)
  ) {
    return null;
  }

  const element = child as {
    type: { displayName?: string };
    props: Record<string, unknown>;
  };

  if (element.type.displayName !== 'SplitViewPane') return null;

  return {
    id: String(element.props.id ?? ''),
    label: typeof element.props.label === 'string' ? element.props.label : undefined,
    minSize: typeof element.props.minSize === 'number' ? element.props.minSize : 120,
    maxSize: typeof element.props.maxSize === 'number' ? element.props.maxSize : 960,
    defaultSize: typeof element.props.defaultSize === 'number' ? element.props.defaultSize : 1,
    collapsible: Boolean(element.props.collapsible),
    defaultVisible: element.props.defaultVisible !== false,
  };
}
