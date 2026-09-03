import type { DropOperation } from './types';

/** Same container → move; different container → copy (Option forces copy). */
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
