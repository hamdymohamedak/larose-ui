import { describe, expect, it } from 'vitest';
import { analyzeRelease, formatReleaseReport } from './release';

describe('analyzeRelease', () => {
  it('detects version drift across publishable packages', () => {
    const report = analyzeRelease([
      {
        name: '@larose-ui/core',
        version: '0.1.0',
        directory: 'packages/core',
        license: 'MIT',
        publishConfig: { access: 'public' },
      },
      {
        name: '@larose-ui/runtime',
        version: '0.2.0',
        directory: 'packages/runtime',
        license: 'MIT',
        publishConfig: { access: 'public' },
      },
      {
        name: '@larose-ui/playground',
        version: '0.1.0',
        directory: 'apps/playground',
        private: true,
      },
    ]);

    expect(report.aligned).toBe(false);
    expect(report.drift).toHaveLength(1);
    expect(report.drift[0]?.name).toBe('@larose-ui/runtime');
  });

  it('flags missing publish metadata', () => {
    const report = analyzeRelease([
      {
        name: '@larose-ui/core',
        version: '0.1.0',
        directory: 'packages/core',
      },
    ]);

    expect(report.packages[0]?.publishReady).toBe(false);
    expect(formatReleaseReport(report)).toContain('REVIEW');
  });
});
