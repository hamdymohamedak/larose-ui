import { describe, expect, it } from 'vitest';
import { createInitialTypeAheadState, stepTypeAhead } from './typeAhead';

describe('stepTypeAhead', () => {
  const items = [
    { id: 'save', label: 'Save', type: 'item' as const },
    { id: 'save-as', label: 'Save As…', type: 'item' as const },
    { id: 'close', label: 'Close', type: 'item' as const },
  ];

  it('highlights first prefix match', () => {
    const result = stepTypeAhead(createInitialTypeAheadState(), 's', items, 1000);
    expect(result.state.buffer).toBe('s');
    expect(result.highlightedId).toBe('save');
  });

  it('cycles on repeated key within reset window', () => {
    const first = stepTypeAhead(createInitialTypeAheadState(), 's', items, 1000);
    const second = stepTypeAhead(first.state, 's', items, 1100);
    expect(second.highlightedId).toBe('save-as');
  });
});
