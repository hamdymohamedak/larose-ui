import type { ThemeMode } from '@larose-ui/core';

export interface PopoverTokens {
  radius: string;
  shadow: string;
  background: string;
  border: string;
  padding: string;
}

export function getPopoverTokens(mode: ThemeMode): PopoverTokens {
  if (mode === 'dark') {
    return {
      radius: 'var(--lr-radius-md)',
      shadow: 'var(--lr-shadow-md)',
      background: 'var(--lr-color-surface-elevated)',
      border: 'var(--lr-color-border)',
      padding: 'var(--lr-space-3)',
    };
  }

  return {
    radius: 'var(--lr-radius-md)',
    shadow: 'var(--lr-shadow-md)',
    background: 'var(--lr-color-surface-elevated)',
    border: 'var(--lr-color-border)',
    padding: 'var(--lr-space-3)',
  };
}

export function popoverTokensToCSSVariables(tokens: PopoverTokens): Record<string, string> {
  return {
    '--lr-popover-radius': tokens.radius,
    '--lr-popover-shadow': tokens.shadow,
    '--lr-popover-background': tokens.background,
    '--lr-popover-border': tokens.border,
    '--lr-popover-padding': tokens.padding,
  };
}
