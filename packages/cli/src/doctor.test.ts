import { describe, expect, it } from 'vitest';
import { formatDoctorReport, runGenerate, formatDoctorJson } from './doctor';
import { validateContract } from '@larose-ui/contracts';

describe('runGenerate', () => {
  it('generates form scaffold', () => {
    const code = runGenerate('form', 'Employee');
    expect(code).toContain('EmployeeForm');
    expect(code).toContain('LaRoseProvider');
  });

  it('generates page scaffold', () => {
    const code = runGenerate('page', 'Employee');
    expect(code).toContain('DataView');
    expect(code).toContain('useJourneyPage');
  });

  it('generates feature scaffold', () => {
    const code = runGenerate('feature', 'EmployeeList');
    expect(code).toContain('SmartTable');
    expect(code).toContain('DevToolsProvider');
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
  it('formats pass result with quality score', () => {
    const report = formatDoctorReport({
      passed: true,
      diagnostics: [],
      quality: { overall: 100, components: [], packages: [] },
    });
    expect(report).toContain('100/100');
    expect(report).toContain('PASS');
  });
});

describe('formatDoctorJson', () => {
  it('outputs structured JSON', () => {
    const json = formatDoctorJson(
      {
        passed: true,
        diagnostics: [],
        quality: { overall: 95, components: [], packages: [] },
      },
      { ci: true },
    );
    const parsed = JSON.parse(json) as { passed: boolean; ci: boolean; qualityScore: number };
    expect(parsed.passed).toBe(true);
    expect(parsed.ci).toBe(true);
    expect(parsed.qualityScore).toBe(95);
  });
});
