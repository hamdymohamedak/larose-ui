import type { ContextMenuEntry } from '../ContextMenu/types';
import { prepareContextMenuEntries } from '../ContextMenu/utils';
import type { DockMenuPosition, DockWindow } from './types';

export function windowToMenuEntry(
  window: DockWindow,
  onSelect?: (window: DockWindow) => void,
): ContextMenuEntry {
  return {
    id: `window-${window.id}`,
    label: window.title,
    type: 'item',
    onSelect: () => onSelect?.(window),
  };
}

export function buildDockMenuEntries(options: {
  isRunning: boolean;
  openWindows?: DockWindow[];
  runningEntries?: ContextMenuEntry[];
  closedEntries?: ContextMenuEntry[];
  onWindowSelect?: (window: DockWindow) => void;
}): ContextMenuEntry[] {
  const {
    isRunning,
    openWindows = [],
    runningEntries = [],
    closedEntries = [],
    onWindowSelect,
  } = options;

  if (!isRunning) {
    return prepareContextMenuEntries(closedEntries);
  }

  const entries: ContextMenuEntry[] = [];

  if (openWindows.length > 0) {
    entries.push(...openWindows.map((window) => windowToMenuEntry(window, onWindowSelect)));
    if (runningEntries.length > 0) {
      entries.push({ type: 'separator' });
    }
  }

  entries.push(...runningEntries);
  return prepareContextMenuEntries(entries);
}

export function resolveDockMenuPosition(
  anchorRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
): DockMenuPosition {
  let x = anchorRect.left + anchorRect.width / 2 - menuWidth / 2;
  x = Math.max(8, Math.min(x, viewportWidth - menuWidth - 8));
  const y = Math.max(8, anchorRect.top - menuHeight - 8);
  return { x, y };
}

export function quickActionsToEntries(actions: import('../QuickActions/types').QuickActionItem[]): ContextMenuEntry[] {
  return prepareContextMenuEntries(
    actions
      .filter((action) => !action.hidden)
      .map((action) => ({
        id: action.id,
        label: action.label,
        icon: action.icon,
        destructive: action.destructive,
        onSelect: action.onSelect,
      })),
  );
}
