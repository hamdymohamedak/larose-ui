export function createTabIds(baseId: string, value: string): {
  tabId: string;
  panelId: string;
} {
  return {
    tabId: `${baseId}-tab-${value}`,
    panelId: `${baseId}-panel-${value}`,
  };
}

export function resolveControlledValue<T>(
  controlled: T | undefined,
  internal: T,
): T {
  return controlled !== undefined ? controlled : internal;
}

/**
 * Move selection within a list of enabled tab values (ArrowLeft / ArrowRight).
 * Returns the next value, or the current value when no move applies.
 */
export function getAdjacentValue(
  values: readonly string[],
  current: string,
  direction: 1 | -1,
): string {
  const enabled = values.filter(Boolean);
  if (enabled.length === 0) return current;
  const index = enabled.indexOf(current);
  if (index === -1) return enabled[0]!;
  const next = (index + direction + enabled.length) % enabled.length;
  return enabled[next]!;
}

export function isTabSelected(activeValue: string, value: string): boolean {
  return activeValue === value;
}

/** Read enabled tab values from a tablist via `data-value`. */
export function getTabValuesFromList(tablist: ParentNode | null | undefined): string[] {
  if (!tablist) return [];
  return Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'))
    .filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true')
    .map((el) => el.dataset.value ?? '')
    .filter(Boolean);
}

export function focusTabByValue(tablist: ParentNode, value: string): void {
  const escaped =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(value)
      : value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const tab = tablist.querySelector<HTMLElement>(
    `[role="tab"][data-value="${escaped}"]`,
  );
  tab?.focus();
}

/**
 * Arrow / Home / End keyboard navigation for a horizontal tablist.
 * Expects each tab to expose `data-value`.
 */
export function handleTabListKeyDown(
  event: KeyboardEvent,
  tablist: ParentNode | null | undefined,
  options: {
    activeValue: string;
    onValueChange: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
  },
): boolean {
  if (!tablist) return false;

  const orientation = options.orientation ?? 'horizontal';
  const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

  const values = getTabValuesFromList(tablist);
  if (values.length === 0) return false;

  let next = options.activeValue;

  if (event.key === prevKey) {
    next = getAdjacentValue(values, options.activeValue, -1);
  } else if (event.key === nextKey) {
    next = getAdjacentValue(values, options.activeValue, 1);
  } else if (event.key === 'Home') {
    next = values[0]!;
  } else if (event.key === 'End') {
    next = values[values.length - 1]!;
  } else {
    return false;
  }

  event.preventDefault();
  if (next !== options.activeValue) {
    options.onValueChange(next);
  }
  focusTabByValue(tablist, next);
  return true;
}
