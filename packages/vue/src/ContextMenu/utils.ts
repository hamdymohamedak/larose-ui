import type { ContextMenuEntry, ContextMenuItemConfig, ContextMenuPosition } from './types';

export const MAX_CONTEXT_MENU_GROUPS = 3;
export const LONG_PRESS_MS = 500;

const CLIPBOARD_IDS = new Set(['cut', 'copy', 'paste']);

export function formatContextMenuTitle(count: number, noun: string): string {
  const label = count === 1 ? noun : `${noun}s`;
  return `${count} ${label}`;
}

export function isSeparator(entry: ContextMenuEntry): boolean {
  return entry.type === 'separator';
}

export function isSubmenu(entry: ContextMenuEntry): entry is Extract<ContextMenuEntry, { type: 'submenu' }> {
  return entry.type === 'submenu';
}

export function isItem(entry: ContextMenuEntry): entry is ContextMenuItemConfig {
  return entry.type !== 'separator' && entry.type !== 'submenu' && 'label' in entry;
}

export function filterContextMenuEntries(entries: ContextMenuEntry[]): ContextMenuEntry[] {
  const result: ContextMenuEntry[] = [];

  for (const entry of entries) {
    if (isSeparator(entry)) {
      result.push(entry);
      continue;
    }

    if (isSubmenu(entry)) {
      const items = entry.items.filter(
        (item) => !item.hidden && !(item.disabled && !canShowDisabledItem(item)),
      );
      if (items.length > 0) {
        result.push({ ...entry, items });
      }
      continue;
    }

    if (!isItem(entry)) continue;

    if (entry.hidden || (entry.disabled && !canShowDisabledItem(entry))) continue;
    result.push(entry);
  }

  return collapseSeparators(result);
}

/** Move destructive items to the end of each separator group. */
export function orderContextMenuEntries(entries: ContextMenuEntry[]): ContextMenuEntry[] {
  const groups = splitGroups(entries);
  return groups
    .map((group) => {
      const destructive = group.filter((entry) => isItem(entry) && entry.destructive);
      const rest = group.filter((entry) => !(isItem(entry) && entry.destructive));
      return [...rest, ...destructive];
    })
    .flatMap((group, index, all) =>
      index < all.length - 1 ? [...group, { type: 'separator' as const, id: `sep-${index}` }] : group,
    );
}

export function prepareContextMenuEntries(entries: ContextMenuEntry[]): ContextMenuEntry[] {
  return orderContextMenuEntries(filterContextMenuEntries(entries));
}

export function countContextMenuGroups(entries: ContextMenuEntry[]): number {
  return splitGroups(entries).length;
}

export function warnIfTooManyGroups(entries: ContextMenuEntry[]): void {
  const groups = countContextMenuGroups(entries);
  if (groups > MAX_CONTEXT_MENU_GROUPS) {
    console.warn(
      `Context menus work best with about ${MAX_CONTEXT_MENU_GROUPS} groups; found ${groups}.`,
    );
  }
}

export function canShowDisabledItem(item: ContextMenuItemConfig): boolean {
  return item.disabled === true && CLIPBOARD_IDS.has(item.id);
}

export function resolveMenuPosition(
  clientX: number,
  clientY: number,
  menuWidth: number,
  menuHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): ContextMenuPosition {
  let x = clientX;
  let y = clientY;
  let placement: ContextMenuPosition['placement'] = 'below';

  if (x + menuWidth > viewportWidth - 8) {
    x = Math.max(8, viewportWidth - menuWidth - 8);
  }

  if (y + menuHeight > viewportHeight - 8) {
    y = Math.max(8, clientY - menuHeight);
    placement = 'above';
  }

  return { x: Math.max(8, x), y: Math.max(8, y), placement };
}

function splitGroups(entries: ContextMenuEntry[]): ContextMenuEntry[][] {
  const groups: ContextMenuEntry[][] = [[]];
  for (const entry of entries) {
    if (isSeparator(entry)) {
      if (groups[groups.length - 1]!.length > 0) groups.push([]);
      continue;
    }
    groups[groups.length - 1]!.push(entry);
  }
  return groups.filter((group) => group.length > 0);
}

function collapseSeparators(entries: ContextMenuEntry[]): ContextMenuEntry[] {
  const result: ContextMenuEntry[] = [];
  for (const entry of entries) {
    if (isSeparator(entry)) {
      if (result.length === 0 || isSeparator(result[result.length - 1]!)) continue;
      result.push(entry);
      continue;
    }
    result.push(entry);
  }
  while (result.length > 0 && isSeparator(result[result.length - 1]!)) {
    result.pop();
  }
  return result;
}
