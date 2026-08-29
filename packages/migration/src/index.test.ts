import { describe, expect, it } from 'vitest';
import { scanSource, generateMigrationReport } from './index';

describe('migration', () => {
  it('detects inline role checks', () => {
    const matches = scanSource(
      "if (user.role === 'admin') { delete(); }",
      'App.tsx',
    );
    expect(matches.some((m) => m.id === 'role-check')).toBe(true);
  });

  it('generates migration report', () => {
    const report = generateMigrationReport([
      { path: 'a.tsx', content: "user.role === 'admin'" },
    ]);
    expect(report.deprecatedUsages).toHaveLength(1);
  });
});
