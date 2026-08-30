import { describe, expect, it } from 'vitest';
import {
  combineValidators,
  createEmailValidator,
  createRequiredValidator,
  formatFieldValue,
  isFormComplete,
  parseNumericInput,
} from './utils';

describe('DataEntry utils', () => {
  it('validates required fields', () => {
    const validate = createRequiredValidator();
    expect(validate('')).toBe('This field is required');
    expect(validate('  ')).toBe('This field is required');
    expect(validate('hello')).toBeNull();
  });

  it('validates email addresses', () => {
    const validate = createEmailValidator();
    expect(validate('')).toBeNull();
    expect(validate('bad')).toBe('Enter a valid email address');
    expect(validate('user@company.com')).toBeNull();
  });

  it('combines validators in order', () => {
    const validate = combineValidators(createRequiredValidator(), createEmailValidator());
    expect(validate('')).toBe('This field is required');
    expect(validate('bad')).toBe('Enter a valid email address');
  });

  it('parses numeric input', () => {
    expect(parseNumericInput('$1,234.50')).toBe(1234.5);
    expect(parseNumericInput('abc')).toBeNull();
  });

  it('formats currency values', () => {
    expect(formatFieldValue('1234.5', 'currency')).toBe('$1,234.50');
  });

  it('checks form completion', () => {
    expect(isFormComplete({ email: 'a@b.com', name: '' }, ['email', 'name'])).toBe(false);
    expect(isFormComplete({ email: 'a@b.com', name: 'Ada' }, ['email', 'name'])).toBe(true);
  });
});
