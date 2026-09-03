export type FieldFormat = 'number' | 'currency' | 'percent';

export type FieldValidator = (value: string) => string | null;

export interface FormatFieldOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function createRequiredValidator(message = 'This field is required'): FieldValidator {
  return (value: string) => (value.trim().length > 0 ? null : message);
}

export function createEmailValidator(message = 'Enter a valid email address'): FieldValidator {
  return (value: string) => {
    if (!value.trim()) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message;
  };
}

export function combineValidators(...validators: FieldValidator[]): FieldValidator {
  return (value: string) => {
    for (const validate of validators) {
      const result = validate(value);
      if (result) return result;
    }
    return null;
  };
}

export function parseNumericInput(value: string): number | null {
  const normalized = value.replace(/[^\d.,-]/g, '').replace(/,/g, '');
  if (!normalized) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatFieldValue(
  value: string,
  format: FieldFormat,
  options: FormatFieldOptions = {},
): string {
  const parsed = parseNumericInput(value);
  if (parsed === null) return value;

  const locale = options.locale ?? 'en-US';
  const minimumFractionDigits = options.minimumFractionDigits;
  const maximumFractionDigits = options.maximumFractionDigits;

  if (format === 'currency') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: options.currency ?? 'USD',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(parsed);
  }

  if (format === 'percent') {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(parsed / 100);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(parsed);
}

export function isFormComplete(values: Record<string, string>, requiredKeys: string[]): boolean {
  return requiredKeys.every((key) => (values[key] ?? '').trim().length > 0);
}

export function fieldIdFromLabel(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}
