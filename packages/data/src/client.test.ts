import { describe, expect, it } from 'vitest';
import { classifyHttpError } from '@larose-ui/core';
import { getRetryDelay, isApiError, ApiRequestError } from '@larose-ui/data-core';

describe('client helpers', () => {
  it('calculates exponential retry delay', () => {
    expect(getRetryDelay(0)).toBe(1000);
    expect(getRetryDelay(2)).toBe(4000);
    expect(getRetryDelay(10)).toBe(30000);
  });

  it('identifies ApiRequestError', () => {
    const err = new ApiRequestError(classifyHttpError(404));
    expect(isApiError(err)).toBe(true);
  });
});
