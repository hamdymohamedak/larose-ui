import { describe, expect, it, vi } from 'vitest';
import {
  createUndoAction,
  findUndoAction,
  removeUndoAction,
} from './undo';

describe('undo helpers', () => {
  it('creates an action with expiry', () => {
    const undo = vi.fn();
    const action = createUndoAction('Deleted row', { id: 1 }, undo, 5000, 'undo-fixed');
    expect(action.id).toBe('undo-fixed');
    expect(action.label).toBe('Deleted row');
    expect(action.data).toEqual({ id: 1 });
    expect(action.expiresAt).toBeGreaterThan(Date.now());
    action.undo();
    expect(undo).toHaveBeenCalled();
  });

  it('finds and removes actions by id', () => {
    const a = createUndoAction('A', null, () => undefined, 1000, 'a');
    const b = createUndoAction('B', null, () => undefined, 1000, 'b');
    const list = [a, b];
    expect(findUndoAction(list, 'b')?.label).toBe('B');
    expect(removeUndoAction(list, 'a')).toEqual([b]);
  });
});
