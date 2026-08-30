import type {
  EditMenuContext,
  EditMenuInputMode,
  EditMenuItemConfig,
  EditMenuPosition,
  EditMenuResolvedAction,
  EditMenuVariant,
  StandardEditActionId,
} from './types';

export const LONG_PRESS_MS = 500;

const STANDARD_LABELS: Record<StandardEditActionId, string> = {
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste',
  select: 'Select',
  selectAll: 'Select All',
  delete: 'Delete',
  translate: 'Translate',
  lookUp: 'Look Up',
};

const CLIPBOARD_IDS = new Set<StandardEditActionId>(['cut', 'copy', 'paste']);

export function resolveEditMenuVariant(
  variant: EditMenuVariant,
  inputMode: EditMenuInputMode,
  pointerType?: string,
): 'compact' | 'context' {
  if (variant !== 'auto') return variant;
  const mode = inputMode === 'auto' ? (pointerType === 'touch' ? 'touch' : 'pointer') : inputMode;
  return mode === 'touch' ? 'compact' : 'context';
}

export function isStandardActionAvailable(
  id: StandardEditActionId,
  context: EditMenuContext,
): boolean {
  const { hasSelection, canPaste, isEditable = true, allowsCopy = false, contentType } = context;

  switch (id) {
    case 'cut':
      return hasSelection && isEditable;
    case 'copy':
      return hasSelection || allowsCopy;
    case 'paste':
      return canPaste && isEditable;
    case 'select':
      return !hasSelection;
    case 'selectAll':
      return true;
    case 'delete':
      return hasSelection && isEditable;
    case 'translate':
      return hasSelection && (contentType === 'text' || contentType === 'address');
    case 'lookUp':
      return hasSelection && contentType === 'text';
    default:
      return false;
  }
}

function standardAction(
  id: StandardEditActionId,
  context: EditMenuContext,
  onSelect?: (id: StandardEditActionId) => void,
): EditMenuResolvedAction | null {
  const available = isStandardActionAvailable(id, context);

  if (id === 'paste' && !context.canPaste) return null;
  if ((id === 'cut' || id === 'copy' || id === 'delete') && !available) return null;
  if (id === 'select' && context.hasSelection) return null;
  if ((id === 'translate' || id === 'lookUp') && !available) return null;

  const group =
    id === 'cut' || id === 'copy' || id === 'paste'
      ? 'clipboard'
      : id === 'select' || id === 'selectAll'
        ? 'selection'
        : id === 'translate' || id === 'lookUp'
          ? 'intelligence'
          : 'other';

  return {
    id,
    label: STANDARD_LABELS[id],
    group,
    standard: true,
    destructive: id === 'delete',
    onSelect: () => onSelect?.(id),
  };
}

export function buildEditMenuActions(
  context: EditMenuContext,
  customActions: EditMenuItemConfig[] = [],
  options?: {
    includeStandard?: boolean;
    onStandardAction?: (id: StandardEditActionId) => void;
  },
): EditMenuResolvedAction[] {
  const { includeStandard = true, onStandardAction } = options ?? {};
  const actions: EditMenuResolvedAction[] = [];

  if (includeStandard) {
    const order: StandardEditActionId[] = [
      'cut',
      'copy',
      'paste',
      'select',
      'selectAll',
      'translate',
      'lookUp',
      'delete',
    ];
    for (const id of order) {
      const action = standardAction(id, context, onStandardAction);
      if (action) actions.push(action);
    }
  }

  for (const custom of customActions) {
    if (custom.hidden) continue;
    if (custom.disabled && !CLIPBOARD_IDS.has(custom.id as StandardEditActionId)) continue;
    actions.push({ ...custom, standard: false });
  }

  return orderEditMenuActions(actions);
}

/** Place custom commands near related system-provided ones. */
export function orderEditMenuActions(actions: EditMenuResolvedAction[]): EditMenuResolvedAction[] {
  const groupOrder: Array<EditMenuResolvedAction['group']> = [
    'clipboard',
    'selection',
    'intelligence',
    'format',
    'other',
  ];

  const buckets = new Map<string, EditMenuResolvedAction[]>();
  for (const group of groupOrder) buckets.set(group ?? 'other', []);

  for (const action of actions) {
    const key = action.group ?? 'other';
    buckets.get(key)?.push(action);
  }

  const ordered: EditMenuResolvedAction[] = [];
  for (const group of groupOrder) {
    const items = buckets.get(group ?? 'other') ?? [];
    const destructive = items.filter((item) => item.destructive);
    const rest = items.filter((item) => !item.destructive);
    ordered.push(...rest, ...destructive);
  }

  return ordered;
}

export function filterVisibleEditMenuActions(actions: EditMenuResolvedAction[]): EditMenuResolvedAction[] {
  return actions.filter((action) => {
    if (action.hidden) return false;
    if (action.disabled && !CLIPBOARD_IDS.has(action.id as StandardEditActionId)) return false;
    return true;
  });
}

export function resolveEditMenuPosition(
  anchorRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  preferredPlacement: 'above' | 'below' | 'auto' = 'auto',
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
): EditMenuPosition {
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  let placement: EditMenuPosition['placement'] =
    preferredPlacement === 'auto'
      ? anchorRect.top > viewportHeight / 2
        ? 'above'
        : 'below'
      : preferredPlacement;

  if (placement === 'below' && anchorRect.bottom + menuHeight + 16 > viewportHeight) {
    placement = 'above';
  } else if (placement === 'above' && anchorRect.top - menuHeight - 16 < 0) {
    placement = 'below';
  }

  let x = anchorCenterX - menuWidth / 2;
  x = Math.max(8, Math.min(x, viewportWidth - menuWidth - 8));

  const pointerOffset = Math.max(16, Math.min(anchorCenterX - x, menuWidth - 16));

  const y =
    placement === 'below'
      ? Math.min(viewportHeight - menuHeight - 8, anchorRect.bottom + 8)
      : Math.max(8, anchorRect.top - menuHeight - 8);

  return { x, y, placement, pointerOffset };
}

export function compactVisibleCount(total: number, maxVisible = 4): number {
  return Math.min(total, maxVisible);
}

export function canExpandCompactMenu(total: number, maxVisible = 4): boolean {
  return total > maxVisible;
}
