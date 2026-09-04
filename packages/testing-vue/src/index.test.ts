import { describe, expect, it } from 'vitest';
import { defaultTestMatrix, resolveMatrixOptions } from './index';

describe('testing-vue', () => {
  it('re-exports matrix', () => {
    expect(defaultTestMatrix.length).toBeGreaterThan(0);
    expect(resolveMatrixOptions('dark').theme).toBe('dark');
  });
});
