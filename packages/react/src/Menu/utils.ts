import type { MenuEntry, MenuItemConfig, MenuLayout } from './types';

export const MAX_SUBMENU_ITEMS = 5;

const SMALL_COMPACT_COUNT = 4;
const MEDIUM_COMPACT_COUNT = 3;

export function formatMenuLabel(label: string): string {
  return label.trim();
}

export function isMenuSeparator(entry: MenuEntry): boolean {
  return entry.type === 'separator';
}

export function isMenuSubmenu(entry: MenuEntry): entry is Extract<MenuEntry, { type: 'submenu' }> {
  return entry.type === 'submenu';
}

export function isMenuItem(entry: MenuEntry): entry is MenuItemConfig {
  return entry.type !== 'separator' && entry.type !== 'submenu' && 'label' in entry;
}

export function filterMenuEntries(entries: MenuEntry[]): MenuEntry[] {
  const result: MenuEntry[] = [];

  for (const entry of entries) {
    if (isMenuSeparator(entry)) {
      result.push(entry);
      continue;
    }

    if (isMenuSubmenu(entry)) {
      if (entry.hidden) continue;
      const items = entry.items.filter((item) => !item.hidden);
      if (items.length === 0) continue;
      if (items.length > MAX_SUBMENU_ITEMS) {
        console.warn(
          `Submenu "${entry.label}" works best with about ${MAX_SUBMENU_ITEMS} items; found ${items.length}.`,
        );
      }
      result.push({ ...entry, items, disabled: entry.disabled });
      continue;
    }

    if (!isMenuItem(entry)) continue;
    if (entry.hidden) continue;
    result.push(entry);
  }

  return collapseSeparators(result);
}

export function orderMenuEntries(entries: MenuEntry[]): MenuEntry[] {
  const groups = splitGroups(entries);
  return groups
    .map((group) => {
      const destructive = group.filter((entry) => isMenuItem(entry) && entry.destructive);
      const rest = group.filter((entry) => !(isMenuItem(entry) && entry.destructive));
      return [...rest, ...destructive];
    })
    .flatMap((group, index, all) =>
      index < all.length - 1 ? [...group, { type: 'separator' as const, id: `sep-${index}` }] : group,
    );
}

export function prepareMenuEntries(entries: MenuEntry[]): MenuEntry[] {
  return orderMenuEntries(filterMenuEntries(entries));
}

export function splitCompactAndList(
  entries: MenuEntry[],
  layout: MenuLayout,
): { compact: MenuItemConfig[]; list: MenuEntry[] } {
  const items = entries.filter((entry): entry is MenuItemConfig => isMenuItem(entry));
  if (layout === 'large') return { compact: [], list: entries };
  const count = layout === 'small' ? SMALL_COMPACT_COUNT : MEDIUM_COMPACT_COUNT;
  return {
    compact: items.slice(0, count),
    list: [
      ...entries.filter((entry) => !isMenuItem(entry) || !items.slice(0, count).includes(entry)),
      ...items.slice(count),
    ],
  };
}

export function resolveMenuPanelPosition(
  anchorRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800,
): { x: number; y: number; placement: 'above' | 'below' } {
  let x = anchorRect.left;
  let y = anchorRect.bottom + 8;
  let placement: 'above' | 'below' = 'below';

  if (x + menuWidth > viewportWidth - 8) x = Math.max(8, viewportWidth - menuWidth - 8);
  if (y + menuHeight > viewportHeight - 8) {
    y = Math.max(8, anchorRect.top - menuHeight - 8);
    placement = 'above';
  }

  return { x: Math.max(8, x), y, placement };
}

function splitGroups(entries: MenuEntry[]): MenuEntry[][] {
  const groups: MenuEntry[][] = [[]];
  for (const entry of entries) {
    if (isMenuSeparator(entry)) {
      if (groups[groups.length - 1]!.length > 0) groups.push([]);
      continue;
    }
    groups[groups.length - 1]!.push(entry);
  }
  return groups.filter((group) => group.length > 0);
}

function collapseSeparators(entries: MenuEntry[]): MenuEntry[] {
  const result: MenuEntry[] = [];
  for (const entry of entries) {
    if (isMenuSeparator(entry)) {
      if (result.length === 0 || isMenuSeparator(result[result.length - 1]!)) continue;
      result.push(entry);
      continue;
    }
    result.push(entry);
  }
  while (result.length > 0 && isMenuSeparator(result[result.length - 1]!)) {
    result.pop();
  }
  return result;
}
