import type { ThemeMode } from '@larose-ui/core';

export interface CardTokens {
  radius: string;
  shadow: string;
  background: string;
  border: string;
  titleSize: string;
  descriptionSize: string;
  bodySize: string;
}

export function getCardTokens(mode: ThemeMode): CardTokens {
  void mode;
  return {
    radius: 'var(--lr-radius-lg)',
    shadow: 'var(--lr-shadow-sm)',
    background: 'var(--lr-color-surface-elevated)',
    border: 'var(--lr-color-border)',
    titleSize: 'var(--lr-font-size-lg)',
    descriptionSize: 'var(--lr-font-size-sm)',
    bodySize: 'var(--lr-font-size-sm)',
  };
}

export function cardTokensToCSSVariables(tokens: CardTokens): Record<string, string> {
  return {
    '--lr-card-radius': tokens.radius,
    '--lr-card-shadow': tokens.shadow,
    '--lr-card-background': tokens.background,
    '--lr-card-border': tokens.border,
    '--lr-card-title-size': tokens.titleSize,
    '--lr-card-description-size': tokens.descriptionSize,
    '--lr-card-body-size': tokens.bodySize,
  };
}
