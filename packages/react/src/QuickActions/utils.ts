import { MAX_HOME_SCREEN_QUICK_ACTIONS } from '@larose-ui/tokens';
import type { QuickActionItem, QuickActionMenuPosition } from './types';

export const DEFAULT_SYSTEM_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'remove-app', label: 'Remove App', system: true, destructive: true },
  { id: 'edit-home-screen', label: 'Edit Home Screen', system: true },
];

export { MAX_HOME_SCREEN_QUICK_ACTIONS };

export function prepareQuickActions(
  actions: QuickActionItem[],
  options?: {
    includeSystemActions?: boolean;
    systemActions?: QuickActionItem[];
  },
): QuickActionItem[] {
  const { includeSystemActions = true, systemActions = DEFAULT_SYSTEM_QUICK_ACTIONS } = options ?? {};

  const appActions = actions.filter((action) => !action.hidden && !action.system);
  if (appActions.length > MAX_HOME_SCREEN_QUICK_ACTIONS) {
    console.warn(
      `Home Screen quick actions work best with at most ${MAX_HOME_SCREEN_QUICK_ACTIONS} app actions; truncating ${appActions.length - MAX_HOME_SCREEN_QUICK_ACTIONS}.`,
    );
  }

  const trimmed = appActions.slice(0, MAX_HOME_SCREEN_QUICK_ACTIONS);
  const visible = trimmed.filter((action) => !(action.disabled && !action.system));

  if (!includeSystemActions) return visible;

  const system = systemActions.filter((action) => !action.hidden);
  return [...visible, ...system];
}

export function resolveQuickActionMenuPosition(
  anchorRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
): QuickActionMenuPosition {
  let x = anchorRect.left + anchorRect.width / 2 - menuWidth / 2;
  x = Math.max(8, Math.min(x, viewportWidth - menuWidth - 8));
  const y = Math.max(8, anchorRect.top - menuHeight - 8);
  return { x, y };
}

export function estimateQuickActionMenuHeight(actionCount: number): number {
  const hasSubtitle = actionCount > 0;
  const rowHeight = hasSubtitle ? 52 : 36;
  return 8 + actionCount * rowHeight;
}
