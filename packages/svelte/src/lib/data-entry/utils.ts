export type FieldFormat = 'number' | 'currency' | 'percent';
export type FieldValidator = (value: string) => string | null;

export function fieldIdFromLabel(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
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
