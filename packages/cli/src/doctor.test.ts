import { describe, expect, it } from 'vitest';
import { formatDoctorReport, runGenerate } from './doctor';
import { validateContract } from '@larose/contracts';

describe('runGenerate', () => {
  it('generates form scaffold', () => {
    expect(runGenerate('form', 'Employee')).toContain('EmployeeForm');
  });

  it('generates page scaffold', () => {
    expect(runGenerate('page', 'Employee')).toContain('DataView');
  });
});

describe('validateContract integration', () => {
  it('detects contract mismatches', () => {
    const result = validateContract(
      { name: 'UI', fields: [{ name: 'department', required: true }] },
      { name: 'API', fields: [{ name: 'name', required: true }] },
    );
    expect(result.valid).toBe(false);
  });
});

describe('formatDoctorReport', () => {
  it('formats pass result', () => {
    expect(formatDoctorReport({ passed: true, diagnostics: [] })).toContain('passed');
  });
});
