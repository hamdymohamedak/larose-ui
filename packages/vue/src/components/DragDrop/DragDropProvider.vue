<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import type { DragItem, DragSession, DropTargetState } from '../../DragDrop/types';
import {
  appendDragItem,
  buildDropResult,
  createDragSession,
  findDropTarget,
  moveDragSession,
  zonesFromElements,
} from '@larose-ui/primitives';
import {
  provideDragDrop,
  type DropZoneRegistration,
} from '../../DragDrop/context';
import DragPreview from './DragPreview.vue';

const session = ref<DragSession | null>(null);
const target = ref<DropTargetState | null>(null);
const revertPreview = ref(false);
const zones = new Map<string, DropZoneRegistration>();

function registerZone(zone: DropZoneRegistration) {
  zones.set(zone.id, zone);
  return () => {
    zones.delete(zone.id);
  };
}

function findTarget(x: number, y: number, items: DragItem[]) {
  return findDropTarget(zonesFromElements(zones.values()), x, y, items);
}

function beginPointerDrag(item: DragItem, pointerId: number, x: number, y: number) {
  revertPreview.value = false;
  session.value = createDragSession(item, pointerId, x, y);
  target.value = null;
}

function addItemToSession(item: DragItem) {
  if (!session.value) return;
  session.value = appendDragItem(session.value, item);
}

function updatePointer(x: number, y: number) {
  if (!session.value) return;
  target.value = findTarget(x, y, session.value.items);
  session.value = moveDragSession(session.value, x, y);
}

async function endPointer(x: number, y: number, optionKey: boolean) {
  const current = session.value;
  if (!current) return;
  const hit = findTarget(x, y, current.items);
  const zone = hit ? zones.get(hit.zoneId) : undefined;
  if (!hit?.valid || !zone) {
    revertPreview.value = true;
    window.setTimeout(() => {
      session.value = null;
      target.value = null;
      revertPreview.value = false;
    }, 220);
    return;
  }
  await zone.onDrop(buildDropResult(current, zone.id, optionKey));
  session.value = null;
  target.value = null;
}

function cancelPointer() {
  session.value = null;
  target.value = null;
  revertPreview.value = false;
}

provideDragDrop({
  session,
  target,
  registerZone,
  beginPointerDrag,
  addItemToSession,
  updatePointer,
  endPointer,
  cancelPointer,
});

let detachWindow: (() => void) | null = null;

function attachWindowListeners(pointerId: number) {
  detachWindow?.();
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
  detachWindow = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
    detachWindow = null;
  };
}

watch(session, (next) => {
  if (!next) {
    detachWindow?.();
    return;
  }
  attachWindowListeners(next.pointerId);
});

onUnmounted(() => detachWindow?.());
</script>

<template>
  <slot />
  <DragPreview :session="session" :revert="revertPreview" />
</template>
