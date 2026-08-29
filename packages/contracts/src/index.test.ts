import { describe, expect, it } from 'vitest';
import { validateContract, formatContractReport } from './index';

describe('validateContract', () => {
  const api = {
    name: 'Employee',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'role', type: 'string', required: true },
    ],
  };

  it('passes when UI matches API', () => {
    const ui = {
      name: 'EmployeeForm',
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'role', type: 'string', required: true },
      ],
    };
    expect(validateContract(ui, api).valid).toBe(true);
  });

  it('detects missing API fields', () => {
    const ui = {
      name: 'EmployeeForm',
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'role', type: 'string', required: true },
        { name: 'department', type: 'string', required: true },
      ],
    };
    const result = validateContract(ui, api);
    expect(result.valid).toBe(false);
    expect(result.mismatches.some((m) => m.issue === 'missing_in_api')).toBe(true);
  });

  it('formats report', () => {
    const result = validateContract(
      { name: 'X', fields: [{ name: 'department', required: true }] },
      { name: 'Y', fields: [] },
    );
    expect(formatContractReport(result)).toContain('FAIL');
  });
});
