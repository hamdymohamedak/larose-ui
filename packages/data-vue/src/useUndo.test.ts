import { describe, expect, it, vi } from 'vitest';
import { useUndo } from './useUndo';

describe('useUndo', () => {
  it('registers and undoes an action', async () => {
    const undo = vi.fn();
    const { actions, register, executeUndo } = useUndo({ timeoutMs: 60_000 });
    const id = register('Deleted', { id: 1 }, undo);
    expect(actions.value).toHaveLength(1);
    await executeUndo(id);
    expect(undo).toHaveBeenCalled();
    expect(actions.value).toHaveLength(0);
  });

  it('dismisses without calling undo', () => {
    const undo = vi.fn();
    const { actions, register, dismiss } = useUndo({ timeoutMs: 60_000 });
    const id = register('Deleted', null, undo);
    dismiss(id);
    expect(undo).not.toHaveBeenCalled();
    expect(actions.value).toHaveLength(0);
  });
});
