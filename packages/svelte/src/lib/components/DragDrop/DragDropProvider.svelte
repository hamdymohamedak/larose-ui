<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DragItem, DragSession, DropTargetState } from '../../DragDrop/types';
  import {
    appendDragItem,
    buildDropResult,
    createDragSession,
    findDropTarget,
    moveDragSession,
    zonesFromElements,
  } from '@larose-ui/primitives';
  import { setDragDropContext, type DropZoneRegistration } from '../../DragDrop/context';
  import DragPreview from './DragPreview.svelte';

  let { children }: { children?: Snippet } = $props();

  let session = $state<DragSession | null>(null);
  let target = $state<DropTargetState | null>(null);
  let revertPreview = $state(false);
  const zones = new Map<string, DropZoneRegistration>();

  function findTarget(x: number, y: number, items: DragItem[]) {
    return findDropTarget(zonesFromElements(zones.values()), x, y, items);
  }

  function updatePointer(x: number, y: number) {
    if (!session) return;
    target = findTarget(x, y, session.items);
    session = moveDragSession(session, x, y);
  }

  async function endPointer(x: number, y: number, optionKey: boolean) {
    const current = session;
    if (!current) return;
    const hit = findTarget(x, y, current.items);
    const zone = hit ? zones.get(hit.zoneId) : undefined;
    if (!hit?.valid || !zone) {
      revertPreview = true;
      window.setTimeout(() => {
        session = null;
        target = null;
        revertPreview = false;
      }, 220);
      return;
    }
    await zone.onDrop(buildDropResult(current, zone.id, optionKey));
    session = null;
    target = null;
  }

  function cancelPointer() {
    session = null;
    target = null;
    revertPreview = false;
  }

  setDragDropContext({
    getSession: () => session,
    getTarget: () => target,
    getRevert: () => revertPreview,
    registerZone(zone) {
      zones.set(zone.id, zone);
      return () => {
        zones.delete(zone.id);
      };
    },
    beginPointerDrag(item, pointerId, x, y) {
      revertPreview = false;
      session = createDragSession(item, pointerId, x, y);
      target = null;
    },
    addItemToSession(item) {
      if (!session) return;
      session = appendDragItem(session, item);
    },
    updatePointer,
    endPointer,
    cancelPointer,
  });

  $effect(() => {
    const current = session;
    if (!current) return;
    const pointerId = current.pointerId;
    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      updatePointer(event.clientX, event.clientY);
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      void endPointer(event.clientX, event.clientY, event.altKey);
    };
    const onCancel = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      cancelPointer();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  });
</script>

{@render children?.()}
<DragPreview {session} revert={revertPreview} />
