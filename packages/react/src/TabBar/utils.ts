export const MAX_TAB_BAR_ITEMS = 5;

export function warnIfTooManyTabs(count: number): void {
  if (count > MAX_TAB_BAR_ITEMS) {
    console.warn(
      `Tab bar has ${count} tabs. More than ${MAX_TAB_BAR_ITEMS} may overflow into a More tab on iOS/iPadOS.`,
    );
  }
}

export function warnIfTabDisabledHidden(disabled: boolean, hidden: boolean): void {
  if (hidden && disabled) {
    console.warn('Do not hide tab bar items — keep them visible and use disabled when unavailable.');
  }
}

export function formatTabBarBadge(badge?: number | '!'): string | undefined {
  if (badge === '!') return '!';
  if (typeof badge === 'number' && badge > 0) return badge > 99 ? '99+' : String(badge);
  return undefined;
}

export function resolveTabBarPlacement(platform: 'ios' | 'ipados' | 'visionos' | 'tvos'): 'bottom' | 'top' | 'leading' {
  if (platform === 'visionos') return 'leading';
  if (platform === 'ipados') return 'top';
  return 'bottom';
}
