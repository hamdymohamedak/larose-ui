import type { ThemeMode } from '@larose-ui/core';

export interface DataEntryTokens {
  fieldHeightMd: string;
  fieldRadius: string;
  fieldBg: string;
  fieldBorder: string;
  fieldBorderFocus: string;
  fieldFocusRing: string;
  fieldErrorBorder: string;
  fieldErrorRing: string;
  labelWeight: string;
  hintSize: string;
  requiredColor: string;
}

/**
 * Apple HIG-inspired data entry tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/entering-data
 */
export function getDataEntryTokens(mode: ThemeMode): DataEntryTokens {
  if (mode === 'dark') {
    return {
      fieldHeightMd: '2.75rem',
      fieldRadius: '0.625rem',
      fieldBg: 'rgb(118 118 128 / 0.24)',
      fieldBorder: 'transparent',
      fieldBorderFocus: '#0a84ff',
      fieldFocusRing: '0 0 0 3px rgb(10 132 255 / 0.35)',
      fieldErrorBorder: '#ff453a',
      fieldErrorRing: '0 0 0 3px rgb(255 69 58 / 0.35)',
      labelWeight: '600',
      hintSize: '0.8125rem',
      requiredColor: '#ff453a',
    };
  }

  return {
    fieldHeightMd: '2.75rem',
    fieldRadius: '0.625rem',
    fieldBg: 'rgb(118 118 128 / 0.12)',
    fieldBorder: 'transparent',
    fieldBorderFocus: '#0071e3',
    fieldFocusRing: '0 0 0 3px rgb(0 113 227 / 0.25)',
    fieldErrorBorder: '#ff3b30',
    fieldErrorRing: '0 0 0 3px rgb(255 59 48 / 0.25)',
    labelWeight: '600',
    hintSize: '0.8125rem',
    requiredColor: '#ff3b30',
  };
}

export function dataEntryTokensToCSSVariables(tokens: DataEntryTokens): Record<string, string> {
  return {
    '--lr-field-height-md': tokens.fieldHeightMd,
    '--lr-field-radius': tokens.fieldRadius,
    '--lr-field-bg': tokens.fieldBg,
    '--lr-field-border': tokens.fieldBorder,
    '--lr-field-border-focus': tokens.fieldBorderFocus,
    '--lr-field-focus-ring': tokens.fieldFocusRing,
    '--lr-field-error-border': tokens.fieldErrorBorder,
    '--lr-field-error-ring': tokens.fieldErrorRing,
    '--lr-field-label-weight': tokens.labelWeight,
    '--lr-field-hint-size': tokens.hintSize,
    '--lr-field-required-color': tokens.requiredColor,
  };
}
