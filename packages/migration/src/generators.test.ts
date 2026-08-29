import { describe, expect, it } from 'vitest';
import { generateFeature, generateForm, generatePage } from './generators';

describe('generators', () => {
  it('generates runtime-aware form scaffold', () => {
    const code = generateForm('Employee');
    expect(code).toContain('LaRoseProvider');
    expect(code).toContain('EmployeeSchema');
    expect(code).toContain('employee.write');
  });

  it('generates page with journey tracking', () => {
    const code = generatePage('Employees', { resource: 'employees' });
    expect(code).toContain('useJourneyPage');
    expect(code).toContain('employees.read');
  });

  it('generates full feature scaffold', () => {
    const code = generateFeature('EmployeeList', { resource: 'employees' });
    expect(code).toContain('SmartTable');
    expect(code).toContain('DevToolsProvider');
    expect(code).toContain('EmployeeListFeature');
  });
});
