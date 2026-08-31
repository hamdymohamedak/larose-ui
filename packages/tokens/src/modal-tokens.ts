import type { ThemeMode } from '@larose-ui/core';

export interface ModalTokens {
  maxWidth: string;
  radius: string;
  shadow: string;
  background: string;
  overlay: string;
  padding: string;
  titleSize: string;
  descriptionSize: string;
}

export function getModalTokens(mode: ThemeMode): ModalTokens {
  if (mode === 'dark') {
    return {
      maxWidth: '32rem',
      radius: 'var(--lr-radius-lg)',
      shadow: 'var(--lr-shadow-lg)',
      background: 'var(--lr-color-surface-elevated)',
      overlay: 'rgb(0 0 0 / 0.55)',
      padding: 'var(--lr-space-6)',
      titleSize: 'var(--lr-font-size-xl)',
      descriptionSize: 'var(--lr-font-size-sm)',
    };
  }

  return {
    maxWidth: '32rem',
    radius: 'var(--lr-radius-lg)',
    shadow: 'var(--lr-shadow-lg)',
    background: 'var(--lr-color-surface-elevated)',
    overlay: 'rgb(0 0 0 / 0.5)',
    padding: 'var(--lr-space-6)',
    titleSize: 'var(--lr-font-size-xl)',
    descriptionSize: 'var(--lr-font-size-sm)',
  };
}

export function modalTokensToCSSVariables(tokens: ModalTokens): Record<string, string> {
  return {
    '--lr-modal-max-width': tokens.maxWidth,
    '--lr-modal-radius': tokens.radius,
    '--lr-modal-shadow': tokens.shadow,
    '--lr-modal-background': tokens.background,
    '--lr-modal-overlay': tokens.overlay,
    '--lr-modal-padding': tokens.padding,
    '--lr-modal-title-size': tokens.titleSize,
    '--lr-modal-description-size': tokens.descriptionSize,
  };
}
