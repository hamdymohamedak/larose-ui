import { describe, expect, it } from 'vitest';
import { checkVersionCompatibility } from './checkVersion';

describe('checkVersionCompatibility', () => {
  it('marks compatible when backend meets minimum', () => {
    const result = checkVersionCompatibility({
      frontend: '1.0.0',
      backend: '2.0.0',
      minBackend: '2.0.0',
    });
    expect(result.compatible).toBe(true);
  });

  it('marks incompatible when backend is below minimum', () => {
    const result = checkVersionCompatibility({
      frontend: '3.0.0',
      backend: '1.0.0',
      minBackend: '2.0.0',
    });
    expect(result.compatible).toBe(false);
    expect(result.warnings[0]).toContain('below minimum');
  });

  it('warns when required feature is deprecated', () => {
    const result = checkVersionCompatibility({
      frontend: '1.0.0',
      backend: '2.0.0',
      requiredFeatures: ['payroll.approve'],
      deprecatedFeatures: ['payroll.approve'],
    });
    expect(result.compatible).toBe(false);
  });
});
