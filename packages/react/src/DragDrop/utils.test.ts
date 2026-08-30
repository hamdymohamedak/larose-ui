import { describe, expect, it } from 'vitest';
import { acceptsDragType, resolveDropOperation } from './utils';

describe('DragDrop utils', () => {
  it('copies across containers', () => {
    expect(resolveDropOperation('a', 'b')).toBe('copy');
  });

  it('moves within the same container', () => {
    expect(resolveDropOperation('a', 'a')).toBe('move');
  });

  it('forces copy with option key in same container', () => {
    expect(resolveDropOperation('a', 'a', true)).toBe('copy');
  });

  it('accepts wildcard types', () => {
    expect(acceptsDragType('*', 'photo')).toBe(true);
  });

  it('rejects mismatched types', () => {
    expect(acceptsDragType('text', 'photo')).toBe(false);
  });
});
