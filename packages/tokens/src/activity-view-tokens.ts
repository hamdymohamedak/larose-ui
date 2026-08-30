import type { ThemeMode } from '@larose-ui/core';

export interface ActivityViewTokens {
  tileSize: string;
  shareIconSize: string;
  actionIconSize: string;
  shareRowGap: string;
  sectionGap: string;
}

/**
 * Apple HIG-inspired activity view (share sheet) tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/activity-views
 */
export function getActivityViewTokens(mode: ThemeMode): ActivityViewTokens {
  void mode;
  return {
    tileSize: '4.375rem',
    shareIconSize: '3.5rem',
    actionIconSize: '2.25rem',
    shareRowGap: '1rem',
    sectionGap: '0.75rem',
  };
}

export function activityViewTokensToCSSVariables(
  tokens: ActivityViewTokens,
): Record<string, string> {
  return {
    '--lr-activity-tile-size': tokens.tileSize,
    '--lr-activity-share-icon-size': tokens.shareIconSize,
    '--lr-activity-action-icon-size': tokens.actionIconSize,
    '--lr-activity-share-row-gap': tokens.shareRowGap,
    '--lr-activity-section-gap': tokens.sectionGap,
  };
}
