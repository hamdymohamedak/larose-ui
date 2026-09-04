import { describe, expect, it } from 'vitest';
import { createAIRuntime, createMockAdapter, parseIntent } from './index';

describe('@larose-ui/ai-react adapter surface', () => {
  it('re-exports ai-core APIs', () => {
    expect(typeof parseIntent).toBe('function');
    expect(typeof createMockAdapter).toBe('function');
    expect(typeof createAIRuntime).toBe('function');
  });
});
