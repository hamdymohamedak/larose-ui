import { describe, expect, it } from 'vitest';
import { getComponentPerformance } from '@larose-ui/devtools-core';

describe('@larose-ui/devtools-vue', () => {
  it('uses shared performance helper from core', () => {
    expect(typeof getComponentPerformance).toBe('function');
  });
});
