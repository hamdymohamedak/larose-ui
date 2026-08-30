import type { PathSegment } from './types';

export const PATH_SEPARATOR = '›';

/** Collapse middle segment labels when the path is too long (Finder-style). */
export function collapsePathSegments(
  segments: PathSegment[],
  maxVisible = 4,
): Array<PathSegment | { type: 'ellipsis'; id: string }> {
  if (segments.length <= maxVisible) return segments;

  const head = segments[0];
  const tail = segments.slice(-(maxVisible - 2));
  if (!head) return segments;

  return [head, { type: 'ellipsis', id: '__ellipsis__' }, ...tail];
}

export function isEllipsisSegment(
  entry: PathSegment | { type: 'ellipsis'; id: string },
): entry is { type: 'ellipsis'; id: string } {
  return 'type' in entry && entry.type === 'ellipsis';
}

export function resolveSelectedSegment(
  segments: PathSegment[],
  selectedId?: string,
): PathSegment {
  if (selectedId) {
    const found = segments.find((segment) => segment.id === selectedId);
    if (found) return found;
  }
  return segments[segments.length - 1] ?? { id: 'root', label: 'Root' };
}

export function warnIfPathControlInToolbar(location: string): void {
  if (location === 'toolbar' || location === 'statusbar') {
    console.warn(
      'Path controls belong in the window body, not in toolbars or status bars.',
    );
  }
}
