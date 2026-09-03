import type { ThemeMode } from '@larose-ui/core';

export interface EditMenuTokens {
  compactRadius: string;
  compactHeight: string;
  compactShadow: string;
  pointerSize: string;
  chevronWidth: string;
}

/**
 * Apple HIG-inspired edit menu tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/edit-menus
 */
export function getEditMenuTokens(mode: ThemeMode): EditMenuTokens {
  if (mode === 'dark') {
    return {
      compactRadius: '0.625rem',
      compactHeight: '2.375rem',
      compactShadow: '0 8px 24px rgb(0 0 0 / 0.45)',
      pointerSize: '0.625rem',
      chevronWidth: '2.25rem',
    };
  }
  return {
    compactRadius: '0.625rem',
    compactHeight: '2.375rem',
    compactShadow: '0 4px 16px rgb(0 0 0 / 0.14)',
    pointerSize: '0.625rem',
    chevronWidth: '2.25rem',
  };
}

export function editMenuTokensToCSSVariables(tokens: EditMenuTokens): Record<string, string> {
  return {
    '--lr-edit-menu-compact-radius': tokens.compactRadius,
    '--lr-edit-menu-compact-height': tokens.compactHeight,
    '--lr-edit-menu-compact-shadow': tokens.compactShadow,
    '--lr-edit-menu-pointer-size': tokens.pointerSize,
    '--lr-edit-menu-chevron-width': tokens.chevronWidth,
  };
}
