import { describe, expect, it } from 'vitest';
import {
  acceptsDragType,
  appendDragItem,
  buildDropResult,
  createDragSession,
  findDropTarget,
  moveDragSession,
  resolveDropOperation,
  shouldBeginDrag,
} from './dragDrop';

describe('dragDrop session helpers', () => {
  it('creates and extends a session', () => {
    const session = createDragSession(
      { id: '1', data: 'a', sourceId: 'list' },
      1,
      10,
      20,
    );
    expect(session.items).toHaveLength(1);
    const next = appendDragItem(session, { id: '2', data: 'b', sourceId: 'list' });
    expect(next.items).toHaveLength(2);
    expect(appendDragItem(next, { id: '1', data: 'a', sourceId: 'list' })).toBe(next);
    expect(moveDragSession(next, 40, 50).x).toBe(40);
  });

  it('hit-tests drop targets', () => {
    const items = [{ id: '1', data: null, sourceId: 'a', type: 'file' }];
    const hit = findDropTarget(
      [
        {
          id: 'zone',
          accepts: ['file'],
          bounds: { left: 0, right: 100, top: 0, bottom: 100 },
        },
      ],
      50,
      50,
      items,
    );
    expect(hit).toEqual({ zoneId: 'zone', valid: true });
    expect(
      findDropTarget(
        [{ id: 'zone', accepts: ['text'], bounds: { left: 0, right: 100, top: 0, bottom: 100 } }],
        50,
        50,
        items,
      ),
    ).toEqual({ zoneId: 'zone', valid: false });
  });

  it('builds drop results and thresholds', () => {
    const session = createDragSession({ id: '1', data: 1, sourceId: 'src' }, 1, 0, 0);
    expect(buildDropResult(session, 'src').operation).toBe('move');
    expect(buildDropResult(session, 'other').operation).toBe('copy');
    expect(shouldBeginDrag(0, 0, 2, 2, 4)).toBe(false);
    expect(shouldBeginDrag(0, 0, 3, 4, 4)).toBe(true);
    expect(resolveDropOperation('a', 'a', true)).toBe('copy');
    expect(acceptsDragType(['*'], 'x')).toBe(true);
  });
});
