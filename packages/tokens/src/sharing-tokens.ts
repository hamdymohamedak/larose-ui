import type { ThemeMode } from '@larose-ui/core';

export interface SharingTokens {
  sheetRadius: string;
  sheetShadow: string;
  avatarSize: string;
  avatarOverlap: string;
  permissionBg: string;
  destinationHover: string;
  sectionDivider: string;
}

/**
 * Apple HIG-inspired collaboration & sharing tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing
 */
export function getSharingTokens(mode: ThemeMode): SharingTokens {
  if (mode === 'dark') {
    return {
      sheetRadius: '0.875rem',
      sheetShadow: '0 12px 40px rgb(0 0 0 / 0.45)',
      avatarSize: '2rem',
      avatarOverlap: '-0.5rem',
      permissionBg: 'rgb(118 118 128 / 0.24)',
      destinationHover: 'rgb(118 118 128 / 0.18)',
      sectionDivider: 'rgb(255 255 255 / 0.1)',
    };
  }

  return {
    sheetRadius: '0.875rem',
    sheetShadow: '0 12px 40px rgb(0 0 0 / 0.14)',
    avatarSize: '2rem',
    avatarOverlap: '-0.5rem',
    permissionBg: 'rgb(118 118 128 / 0.12)',
    destinationHover: 'rgb(118 118 128 / 0.08)',
    sectionDivider: 'rgb(0 0 0 / 0.08)',
  };
}

export function sharingTokensToCSSVariables(tokens: SharingTokens): Record<string, string> {
  return {
    '--lr-sharing-sheet-radius': tokens.sheetRadius,
    '--lr-sharing-sheet-shadow': tokens.sheetShadow,
    '--lr-sharing-avatar-size': tokens.avatarSize,
    '--lr-sharing-avatar-overlap': tokens.avatarOverlap,
    '--lr-sharing-permission-bg': tokens.permissionBg,
    '--lr-sharing-destination-hover': tokens.destinationHover,
    '--lr-sharing-section-divider': tokens.sectionDivider,
  };
}
