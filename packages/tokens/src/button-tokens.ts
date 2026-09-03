import type { ThemeMode } from '@larose-ui/core';

export interface ButtonTokens {
  heightSm: string;
  heightMd: string;
  heightLg: string;
  radius: string;
  paddingInlineSm: string;
  paddingInlineMd: string;
  paddingInlineLg: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontWeight: string;
  destructive: string;
  destructiveHover: string;
  destructiveActive: string;
  secondaryBg: string;
  secondaryBorder: string;
  plainColor: string;
  onPrimaryColor: string;
  minHitRegion: string;
  visionHitRegion: string;
  squareSize: string;
  helpSize: string;
  imagePadding: string;
}

/**
 * Apple HIG-inspired button tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/buttons
 */
export function getButtonTokens(mode: ThemeMode): ButtonTokens {
  if (mode === 'dark') {
    return {
      heightSm: '2rem',
      heightMd: '2.75rem',
      heightLg: '3.25rem',
      radius: '9999px',
      paddingInlineSm: '0.75rem',
      paddingInlineMd: '1.25rem',
      paddingInlineLg: '1.5rem',
      fontSizeSm: '0.8125rem',
      fontSizeMd: '0.9375rem',
      fontSizeLg: '1.0625rem',
      fontWeight: '600',
      destructive: '#ff453a',
      destructiveHover: '#ff6961',
      destructiveActive: '#d70015',
      secondaryBg: 'rgb(118 118 128 / 0.24)',
      secondaryBorder: 'transparent',
      plainColor: '#0a84ff',
      onPrimaryColor: '#ffffff',
      minHitRegion: '2.75rem',
      visionHitRegion: '3.75rem',
      squareSize: '1.75rem',
      helpSize: '1.375rem',
      imagePadding: '0.625rem',
    };
  }

  return {
    heightSm: '2rem',
    heightMd: '2.75rem',
    heightLg: '3.25rem',
    radius: '9999px',
    paddingInlineSm: '0.75rem',
    paddingInlineMd: '1.25rem',
    paddingInlineLg: '1.5rem',
    fontSizeSm: '0.8125rem',
    fontSizeMd: '0.9375rem',
    fontSizeLg: '1.0625rem',
    fontWeight: '600',
    destructive: '#ff3b30',
    destructiveHover: '#ff6259',
    destructiveActive: '#d70015',
    secondaryBg: 'rgb(118 118 128 / 0.12)',
    secondaryBorder: 'transparent',
    plainColor: '#0071e3',
    onPrimaryColor: '#ffffff',
    minHitRegion: '2.75rem',
    visionHitRegion: '3.75rem',
    squareSize: '1.75rem',
    helpSize: '1.375rem',
    imagePadding: '0.625rem',
  };
}

export function buttonTokensToCSSVariables(tokens: ButtonTokens): Record<string, string> {
  return {
    '--lr-button-height-sm': tokens.heightSm,
    '--lr-button-height-md': tokens.heightMd,
    '--lr-button-height-lg': tokens.heightLg,
    '--lr-button-radius': tokens.radius,
    '--lr-button-padding-inline-sm': tokens.paddingInlineSm,
    '--lr-button-padding-inline-md': tokens.paddingInlineMd,
    '--lr-button-padding-inline-lg': tokens.paddingInlineLg,
    '--lr-button-font-size-sm': tokens.fontSizeSm,
    '--lr-button-font-size-md': tokens.fontSizeMd,
    '--lr-button-font-size-lg': tokens.fontSizeLg,
    '--lr-button-font-weight': tokens.fontWeight,
    '--lr-button-destructive': tokens.destructive,
    '--lr-button-destructive-hover': tokens.destructiveHover,
    '--lr-button-destructive-active': tokens.destructiveActive,
    '--lr-button-secondary-bg': tokens.secondaryBg,
    '--lr-button-secondary-border': tokens.secondaryBorder,
    '--lr-button-plain-color': tokens.plainColor,
    '--lr-button-on-primary-color': tokens.onPrimaryColor,
    '--lr-button-min-hit-region': tokens.minHitRegion,
    '--lr-button-vision-hit-region': tokens.visionHitRegion,
    '--lr-button-square-size': tokens.squareSize,
    '--lr-button-help-size': tokens.helpSize,
    '--lr-button-image-padding': tokens.imagePadding,
  };
}
