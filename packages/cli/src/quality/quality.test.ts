import { describe, expect, it } from 'vitest';
import { DEFAULT_BROWSER_MATRIX, validateBrowserMatrix } from './browserMatrix';
import { computeQualityScores, qualityPassed } from './qualityScores';
import { compareVisualBaseline, type StoryManifestEntry } from './visualManifest';
import type { Diagnostic } from '../doctor';

describe('browserMatrix', () => {
  it('passes with aligned node engine', () => {
    const check = validateBrowserMatrix(DEFAULT_BROWSER_MATRIX, '>=20');
    expect(check.passed).toBe(true);
  });

  it('flags node engine mismatch', () => {
    const check = validateBrowserMatrix(DEFAULT_BROWSER_MATRIX, '>=18');
    expect(check.passed).toBe(false);
    expect(check.issues.length).toBeGreaterThan(0);
  });
});

describe('qualityScores', () => {
  it('computes overall score from diagnostics', () => {
    const diagnostics: Diagnostic[] = [
      {
        severity: 'warning',
        category: 'accessibility',
        message: 'test',
        file: 'packages/react/src/Button.tsx',
      },
    ];

    const summary = computeQualityScores(diagnostics);
    expect(summary.overall).toBeLessThan(100);
    expect(summary.components[0]?.id).toContain('Button');
  });

  it('treats warnings as failures in CI mode', () => {
    const diagnostics: Diagnostic[] = [
      { severity: 'warning', category: 'deprecation', message: 'deprecated API' },
    ];
    expect(qualityPassed(diagnostics, { ci: false })).toBe(true);
    expect(qualityPassed(diagnostics, { ci: true })).toBe(false);
  });
});

describe('visualManifest', () => {
  it('detects missing baseline stories', () => {
    const current: StoryManifestEntry[] = [
      { file: 'Button.stories.tsx', title: 'Foundation/Button' },
    ];
    const result = compareVisualBaseline(current, {
      version: 1,
      stories: [
        { file: 'Button.stories.tsx', title: 'Foundation/Button' },
        { file: 'Input.stories.tsx', title: 'Foundation/Input' },
      ],
    });

    expect(result.passed).toBe(false);
    expect(result.missing).toHaveLength(1);
  });
});
