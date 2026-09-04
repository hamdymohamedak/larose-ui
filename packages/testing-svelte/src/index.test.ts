import { describe, expect, it } from 'vitest';
import { defaultTestMatrix, resolveMatrixOptions } from './index';

describe('testing-svelte', () => {
  it('re-exports matrix', () => {
    expect(defaultTestMatrix[0]?.scenario).toBe('normal');
    expect(resolveMatrixOptions('rtl').locale).toBe('ar');
  });
});
