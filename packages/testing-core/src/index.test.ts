import { describe, expect, it } from 'vitest';
import { defaultTestMatrix, resolveMatrixOptions } from './index';

describe('testing-core', () => {
  it('exposes a default matrix', () => {
    expect(defaultTestMatrix.length).toBeGreaterThan(5);
  });

  it('resolves scenario options', () => {
    expect(resolveMatrixOptions('rtl').locale).toBe('ar');
    expect(resolveMatrixOptions('dark', { locale: 'en' })).toEqual({
      theme: 'dark',
      locale: 'en',
    });
  });
});
