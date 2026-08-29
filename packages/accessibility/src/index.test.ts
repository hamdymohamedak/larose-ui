import { describe, expect, it } from 'vitest';
import { formatA11yReport, scanComponentSource } from './index';

describe('scanComponentSource', () => {
  it('passes accessible dialog', () => {
    const result = scanComponentSource(
      '<div role="dialog" aria-labelledby="title"><h2 id="title">Hi</h2></div>',
    );
    expect(result.passed).toBe(true);
  });

  it('flags dialog without label', () => {
    const result = scanComponentSource('<div role="dialog">Content</div>');
    expect(result.passed).toBe(false);
    expect(result.violations[0]?.rule).toBe('dialog-label');
  });

  it('formats report', () => {
    const report = formatA11yReport({
      passed: false,
      violations: [{ severity: 'error', rule: 'dialog-label', message: 'missing' }],
    });
    expect(report).toContain('FAIL');
  });
});
