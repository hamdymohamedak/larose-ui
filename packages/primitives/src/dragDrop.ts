export type DropOperation = 'move' | 'copy';

export interface DragItem<T = unknown> {
  id: string;
  type?: string;
  data: T;
  sourceId: string;
  preview?: unknown;
  label?: string;
}

export interface DragSession<T = unknown> {
  items: DragItem<T>[];
  sourceId: string;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
}

export interface DropTargetState {
  zoneId: string;
  valid: boolean;
}

export interface DropResult<T = unknown> {
  items: DragItem<T>[];
  sourceId: string;
  destinationId: string;
  operation: DropOperation;
}

export interface RectBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Framework-agnostic drop-zone hit-test descriptor. */
export interface DropZoneHitTest<T = unknown> {
  id: string;
  accepts?: string | string[];
  canDrop?: (items: DragItem<T>[]) => boolean;
  bounds: RectBounds | null | undefined;
}

/** Same container → move; different container → copy (Option/Alt forces copy). */
export function resolveDropOperation(
  sourceId: string,
  destinationId: string,
  optionKey = false,
): DropOperation {
  if (sourceId !== destinationId) return 'copy';
  return optionKey ? 'copy' : 'move';
}

export function acceptsDragType(
  accepts: string | string[] | undefined,
  itemType: string | undefined,
): boolean {
  if (!accepts) return true;
  const types = Array.isArray(accepts) ? accepts : [accepts];
  if (!itemType) return types.includes('*');
  return types.includes('*') || types.includes(itemType);
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function pointInBounds(x: number, y: number, bounds: RectBounds): boolean {
  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}

export function shouldBeginDrag(
  startX: number,
  startY: number,
  x: number,
  y: number,
  thresholdPx: number,
): boolean {
  return distance(startX, startY, x, y) >= thresholdPx;
}

export function createDragSession<T>(
  item: DragItem<T>,
  pointerId: number,
  x: number,
  y: number,
): DragSession<T> {
  return {
    items: [item],
    sourceId: item.sourceId,
    pointerId,
    startX: x,
    startY: y,
    x,
    y,
  };
}

export function appendDragItem<T>(
  session: DragSession<T>,
  item: DragItem<T>,
): DragSession<T> {
  if (session.items.some((entry) => entry.id === item.id)) return session;
  return { ...session, items: [...session.items, item] };
}

export function moveDragSession<T>(
  session: DragSession<T>,
  x: number,
  y: number,
): DragSession<T> {
  return { ...session, x, y };
}

export function findDropTarget<T>(
  zones: Iterable<DropZoneHitTest<T>>,
  x: number,
  y: number,
  items: DragItem<T>[],
): DropTargetState | null {
  for (const zone of zones) {
    if (!zone.bounds || !pointInBounds(x, y, zone.bounds)) continue;
    const typeOk = items.every((item) => acceptsDragType(zone.accepts, item.type));
    const customOk = zone.canDrop ? zone.canDrop(items) : true;
    return { zoneId: zone.id, valid: typeOk && customOk };
  }
  return null;
}

export function buildDropResult<T>(
  session: DragSession<T>,
  destinationId: string,
  optionKey = false,
): DropResult<T> {
  return {
    items: session.items,
    sourceId: session.sourceId,
    destinationId,
    operation: resolveDropOperation(session.sourceId, destinationId, optionKey),
  };
}

/** Map a live element list into hit-test descriptors (DOM adapter). */
export function zonesFromElements<T>(
  zones: Iterable<{
    id: string;
    accepts?: string | string[];
    canDrop?: (items: DragItem<T>[]) => boolean;
    element: { getBoundingClientRect(): RectBounds } | null;
  }>,
): DropZoneHitTest<T>[] {
  return [...zones].map((zone) => ({
    id: zone.id,
    accepts: zone.accepts,
    canDrop: zone.canDrop,
    bounds: zone.element?.getBoundingClientRect() ?? null,
  }));
}
