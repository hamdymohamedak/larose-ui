import type { ThemeMode } from '@larose-ui/core';

export interface AlertDialogTokens {
  maxWidth: string;
  wideMaxWidth: string;
  radius: string;
  contentPadding: string;
  titleSize: string;
  messageSize: string;
  iconSize: string;
  buttonHeight: string;
  shadow: string;
  background: string;
  overlay: string;
  separator: string;
  backdropBlur: string;
  accessoryMaxHeight: string;
  accessoryRadius: string;
}

export function getAlertDialogTokens(mode: ThemeMode): AlertDialogTokens {
  if (mode === 'dark') {
    return {
      maxWidth: '16.875rem',
      wideMaxWidth: '26.25rem',
      radius: '0.875rem',
      contentPadding: '1.1875rem 1rem 1rem',
      titleSize: '1.0625rem',
      messageSize: '0.8125rem',
      iconSize: '2.75rem',
      buttonHeight: '2.75rem',
      shadow: '0 11px 34px rgb(0 0 0 / 0.55)',
      background: 'rgb(44 44 46 / 0.92)',
      overlay: 'rgb(0 0 0 / 0.4)',
      separator: 'rgb(255 255 255 / 0.14)',
      backdropBlur: '40px',
      accessoryMaxHeight: '9.625rem',
      accessoryRadius: '1rem',
    };
  }

  return {
    maxWidth: '16.875rem',
    wideMaxWidth: '26.25rem',
    radius: '0.875rem',
    contentPadding: '1.1875rem 1rem 1rem',
    titleSize: '1.0625rem',
    messageSize: '0.8125rem',
    iconSize: '2.75rem',
    buttonHeight: '2.75rem',
    shadow: '0 11px 34px rgb(0 0 0 / 0.18)',
    background: 'rgb(255 255 255 / 0.92)',
    overlay: 'rgb(0 0 0 / 0.4)',
    separator: 'rgb(60 60 67 / 0.29)',
    backdropBlur: '40px',
    accessoryMaxHeight: '9.625rem',
    accessoryRadius: '1rem',
  };
}

export function alertDialogTokensToCSSVariables(tokens: AlertDialogTokens): Record<string, string> {
  return {
    '--lr-alert-dialog-max-width': tokens.maxWidth,
    '--lr-alert-dialog-wide-max-width': tokens.wideMaxWidth,
    '--lr-alert-dialog-radius': tokens.radius,
    '--lr-alert-dialog-content-padding': tokens.contentPadding,
    '--lr-alert-dialog-title-size': tokens.titleSize,
    '--lr-alert-dialog-message-size': tokens.messageSize,
    '--lr-alert-dialog-icon-size': tokens.iconSize,
    '--lr-alert-dialog-button-height': tokens.buttonHeight,
    '--lr-alert-dialog-shadow': tokens.shadow,
    '--lr-alert-dialog-bg': tokens.background,
    '--lr-alert-dialog-overlay': tokens.overlay,
    '--lr-alert-dialog-separator': tokens.separator,
    '--lr-alert-dialog-backdrop-blur': tokens.backdropBlur,
    '--lr-alert-dialog-accessory-max-height': tokens.accessoryMaxHeight,
    '--lr-alert-dialog-accessory-radius': tokens.accessoryRadius,
  };
}

export const MAX_ALERT_BUTTONS = 3;

export const MAX_ALERT_TITLE_CHARS = 120;
