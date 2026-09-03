import type { MenuEntry } from '../Menu/types';
import { isMenuItem } from '../Menu/utils';
import type { ToolbarAction } from './types';

export const MAX_TOOLBAR_TITLE_LENGTH = 15;
export const MAX_TOOLBAR_GROUPS = 3;

const OVERFLOW_BUTTON_WIDTH = 36;
const DEFAULT_ITEM_GAP = 4;

export function warnIfToolbarTitleTooLong(title: string): void {
  if (title.length > 15) {
    console.warn(
      `Toolbar title "${title}" is ${title.length} characters. Apple HIG recommends keeping titles under 15 characters.`,
    );
  }
}

export function warnIfTooManyToolbarGroups(groupCount: number): void {
  if (groupCount > 3) {
    console.warn(
      `Toolbar has ${groupCount} item groups. Apple HIG recommends a maximum of about three groups.`,
    );
  }
}

export function warnIfMixedLabelStyles(hasTextButton: boolean, hasSymbolButton: boolean): void {
  if (hasTextButton && hasSymbolButton) {
    console.warn(
      'Toolbar groups text-labeled and symbol buttons together. Separate them with fixed space or distinct groups.',
    );
  }
}

export function computeVisibleToolbarItemCount(
  containerWidth: number,
  itemWidths: number[],
  options?: { overflowButtonWidth?: number; gap?: number },
): number {
  const overflowWidth = options?.overflowButtonWidth ?? OVERFLOW_BUTTON_WIDTH;
  const gap = options?.gap ?? DEFAULT_ITEM_GAP;

  if (containerWidth <= 0 || itemWidths.length === 0) return itemWidths.length;

  let totalWidth = 0;
  for (let index = 0; index < itemWidths.length; index += 1) {
    totalWidth += (index > 0 ? gap : 0) + (itemWidths[index] ?? 0);
  }
  if (totalWidth <= containerWidth) return itemWidths.length;

  for (let visible = itemWidths.length - 1; visible >= 0; visible -= 1) {
    let used = overflowWidth;
    for (let index = 0; index < visible; index += 1) {
      used += (index > 0 ? gap : 0) + (itemWidths[index] ?? 0);
    }
    if (visible > 0) used += gap;
    if (used <= containerWidth) return visible;
  }

  return 0;
}

export function toolbarActionsFromEntries(entries: MenuEntry[]): ToolbarAction[] {
  return entries.filter(isMenuItem).map((entry) => ({
    id: entry.id,
    label: entry.label,
    icon: entry.icon,
    disabled: entry.disabled,
    onSelect: entry.onSelect,
  }));
}

export function entriesFromToolbarActions(actions: ToolbarAction[]): MenuEntry[] {
  return actions.map((action) => ({
    id: action.id,
    label: action.label,
    icon: action.icon,
    disabled: action.disabled,
    onSelect: action.onSelect,
  }));
}

export function resolveToolbarPlacement(
  platform: 'ios' | 'ipados' | 'macos' | 'visionos' | 'watchos',
  placement?: 'top' | 'bottom',
): 'top' | 'bottom' {
  if (placement) return placement;
  if (platform === 'visionos') return 'bottom';
  return 'top';
}

export function shouldUseSystemOverflow(platform: 'ios' | 'ipados' | 'macos' | 'visionos' | 'watchos'): boolean {
  return platform === 'macos' || platform === 'ipados';
}

export function truncateToolbarTitle(title: string, maxLength = 15): string {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength - 1)}…`;
}
