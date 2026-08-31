import { describe, expect, it } from 'vitest';
import {
  validateContract,
  formatContractReport,
  compareComponentContracts,
  validateComponentContractSchema,
  isDataContract,
  isComponentContract,
} from './index';

describe('validateContract (UI ↔ API)', () => {
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

describe('component contracts', () => {
  const canonical = {
    name: 'Button',
    framework: 'neutral' as const,
    props: [
      { name: 'variant', type: 'Variant', required: false, default: 'primary' },
      { name: 'disabled', type: 'boolean', required: false },
      { name: 'onClick', type: '() => void', required: false },
    ],
    events: [{ name: 'onClick', payload: 'MouseEvent' }],
    states: ['default', 'disabled', 'loading'],
    accessibility: { requirements: ['focus-visible ring', 'loading label'] },
    keyboard: { behavior: ['enter-activation', 'space-activation'] },
  };

  it('detects contract type guards', () => {
    expect(isComponentContract(canonical)).toBe(true);
    expect(isDataContract({ ui: { name: 'x', fields: [] }, api: { name: 'y', fields: [] } })).toBe(
      true,
    );
    expect(isComponentContract({ name: 'X' })).toBe(false);
  });

  it('validates contract schema', () => {
    expect(validateComponentContractSchema(canonical).valid).toBe(true);
    expect(validateComponentContractSchema({ name: '', props: [] }).valid).toBe(false);
  });

  it('passes when implementation matches canonical contract', () => {
    const implementation = { ...canonical, framework: 'react' as const };
    expect(compareComponentContracts(implementation, canonical).valid).toBe(true);
  });

  it('detects missing props and keyboard regressions', () => {
    const implementation = {
      name: 'Button',
      props: [{ name: 'variant', type: 'Variant' }],
      events: [],
      keyboard: { behavior: ['enter-activation'] },
    };
    const result = compareComponentContracts(implementation, canonical);
    expect(result.valid).toBe(false);
    expect(result.mismatches.some((m) => m.issue === 'missing_prop')).toBe(true);
    expect(result.mismatches.some((m) => m.issue === 'keyboard_divergence')).toBe(true);
  });
});
