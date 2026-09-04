import { get } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';
import { createUndo } from './createUndo';

describe('createUndo', () => {
  it('registers and undoes an action', async () => {
    const undo = vi.fn();
    const controller = createUndo({ timeoutMs: 60_000 });
    const id = controller.register('Deleted', { id: 1 }, undo);
    expect(get(controller)).toHaveLength(1);
    await controller.executeUndo(id);
    expect(undo).toHaveBeenCalled();
    expect(get(controller)).toHaveLength(0);
    controller.destroy();
  });

  it('dismisses without calling undo', () => {
    const undo = vi.fn();
    const controller = createUndo({ timeoutMs: 60_000 });
    const id = controller.register('Deleted', null, undo);
    controller.dismiss(id);
    expect(undo).not.toHaveBeenCalled();
    expect(get(controller)).toHaveLength(0);
    controller.destroy();
  });
});
