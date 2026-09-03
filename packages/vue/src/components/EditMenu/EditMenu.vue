<script setup lang="ts">
import { computed, onUnmounted, ref, useId, watch } from 'vue';
import type {
  EditMenuContext,
  EditMenuInputMode,
  EditMenuItemConfig,
  EditMenuPosition,
  EditMenuResolvedAction,
  EditMenuVariant,
  StandardEditActionId,
} from '../../EditMenu/types';
import {
  buildEditMenuActions,
  canExpandCompactMenu,
  compactVisibleCount,
  filterVisibleEditMenuActions,
  LONG_PRESS_MS,
  resolveEditMenuPosition,
  resolveEditMenuVariant,
} from '../../EditMenu/utils';
import styles from '@larose-ui/styles/components/EditMenu/EditMenu.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    context: EditMenuContext;
    customActions?: EditMenuItemConfig[];
    includeStandardActions?: boolean;
    variant?: EditMenuVariant;
    inputMode?: EditMenuInputMode;
    placement?: 'above' | 'below' | 'auto';
    open?: boolean;
    longPress?: boolean;
    dimBackground?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  {
    customActions: () => [],
    includeStandardActions: true,
    variant: 'auto',
    inputMode: 'auto',
    placement: 'auto',
    longPress: true,
    dimBackground: true,
  },
);

const emit = defineEmits<{
  'update:open': [boolean];
  openChange: [boolean];
  action: [string];
  standardAction: [StandardEditActionId];
}>();

const menuId = useId();
const triggerRef = ref<HTMLElement | null>(null);
const internal = ref(false);
const resolvedVariant = ref<'compact' | 'context'>(
  resolveEditMenuVariant(props.variant, props.inputMode, 'mouse'),
);
const expanded = ref(false);
const position = ref<EditMenuPosition>({
  x: 100,
  y: 100,
  placement: 'below',
  pointerOffset: 110,
});
let longPressTimer: number | null = null;

const isOpen = computed(() => (props.open !== undefined ? props.open : internal.value));
const actions = computed(() =>
  filterVisibleEditMenuActions(
    buildEditMenuActions(props.context, props.customActions, {
      includeStandard: props.includeStandardActions,
      onStandardAction: (id) => emit('standardAction', id),
    }),
  ),
);
const showCompact = computed(() => resolvedVariant.value === 'compact' && !expanded.value);
const visibleCompact = computed(() =>
  actions.value.slice(0, compactVisibleCount(actions.value.length)),
);

function setOpen(next: boolean) {
  if (!next) expanded.value = false;
  if (props.open === undefined) internal.value = next;
  emit('update:open', next);
  emit('openChange', next);
}

function measureAndOpen(pointerType: string, anchorRect?: DOMRect) {
  const resolved = resolveEditMenuVariant(props.variant, props.inputMode, pointerType);
  resolvedVariant.value = expanded.value ? 'context' : resolved;
  const rect =
    anchorRect ??
    triggerRef.value?.getBoundingClientRect() ??
    new DOMRect(window.innerWidth / 2 - 40, window.innerHeight / 2, 80, 24);
  const menuWidth =
    resolved === 'compact' && !expanded.value
      ? Math.min(320, actions.value.length * 72 + 48)
      : 220;
  const menuHeight =
    resolved === 'compact' && !expanded.value
      ? 40
      : Math.min(360, actions.value.length * 36 + 16);
  position.value = resolveEditMenuPosition(rect, menuWidth, menuHeight, props.placement);
  setOpen(true);
}

function close() {
  setOpen(false);
}

function select(action: EditMenuResolvedAction) {
  action.onSelect?.();
  emit('action', action.id);
  close();
}

function expand() {
  expanded.value = true;
  resolvedVariant.value = 'context';
  const rect =
    triggerRef.value?.getBoundingClientRect() ??
    new DOMRect(position.value.x, position.value.y, 80, 24);
  position.value = resolveEditMenuPosition(
    rect,
    220,
    Math.min(360, actions.value.length * 36 + 16),
    props.placement,
  );
}

function clearLongPress() {
  if (longPressTimer !== null) {
    window.clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

function onContextMenu(event: MouseEvent) {
  event.preventDefault();
  measureAndOpen('mouse', new DOMRect(event.clientX, event.clientY, 1, 1));
}

function onDblClick(event: MouseEvent) {
  measureAndOpen('touch', (event.currentTarget as HTMLElement).getBoundingClientRect());
}

function onPointerDown(event: PointerEvent) {
  if (!props.longPress || event.pointerType === 'mouse') return;
  clearLongPress();
  longPressTimer = window.setTimeout(() => {
    measureAndOpen(
      event.pointerType,
      (event.currentTarget as HTMLElement).getBoundingClientRect(),
    );
  }, LONG_PRESS_MS);
}

watch(isOpen, (open, _prev, onCleanup) => {
  if (!open) return;
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKeyDown);
  onCleanup(() => document.removeEventListener('keydown', onKeyDown));
});

onUnmounted(() => {
  clearLongPress();
});
</script>

<template>
  <span
    ref="triggerRef"
    :class="cn(styles.triggerWrap, props.class)"
    :style="props.style"
    @contextmenu="onContextMenu"
    @dblclick="onDblClick"
    @pointerdown="onPointerDown"
    @pointerup="clearLongPress"
    @pointercancel="clearLongPress"
    @pointerleave="clearLongPress"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div v-if="isOpen && actions.length">
      <div
        v-if="dimBackground"
        :class="styles.menuBackdrop"
        role="presentation"
        @click="close"
      />
      <div
        :class="showCompact ? styles.compactWrap : styles.contextWrap"
        :role="showCompact ? 'toolbar' : undefined"
        aria-label="Edit menu"
        :data-placement="position.placement"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: 'fixed',
          zIndex: 1000,
          '--lr-edit-menu-pointer-x': `${position.pointerOffset}px`,
        }"
        @click.stop
      >
        <span
          :class="styles.pointer"
          aria-hidden="true"
          :data-placement="position.placement"
          style="--lr-edit-menu-pointer-offset: var(--lr-edit-menu-pointer-x)"
        />
        <div v-if="showCompact" :id="menuId" :class="styles.compactBar">
          <template v-for="(action, index) in visibleCompact" :key="action.id">
            <span v-if="index > 0" :class="styles.compactDivider" aria-hidden="true" />
            <button
              type="button"
              :class="styles.compactItem"
              :data-destructive="action.destructive ? 'true' : undefined"
              :disabled="action.disabled"
              @click="select(action)"
            >
              {{ action.label }}
            </button>
          </template>
          <template v-if="canExpandCompactMenu(actions.length)">
            <span :class="styles.compactDivider" aria-hidden="true" />
            <button
              type="button"
              :class="styles.expandButton"
              aria-label="More edit actions"
              aria-haspopup="menu"
              @click="expand"
            >
              <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" aria-hidden="true">
                <path
                  d="M4 2.5 8 6l-4 3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </template>
        </div>
        <div
          v-else
          :id="menuId"
          :class="styles.contextMenu"
          role="menu"
          aria-label="Edit menu"
          style="position: relative"
        >
          <ul :class="styles.list">
            <template v-for="(action, index) in actions" :key="action.id">
              <li
                v-if="index > 0 && (actions[index - 1]?.group ?? 'other') !== (action.group ?? 'other')"
                :class="styles.separator"
                role="separator"
              />
              <li>
                <button
                  type="button"
                  :class="styles.contextItem"
                  role="menuitem"
                  :data-destructive="action.destructive ? 'true' : undefined"
                  :disabled="action.disabled"
                  @click="select(action)"
                >
                  <span v-if="action.icon" :class="styles.icon" />
                  <span :class="styles.label">{{ action.label }}</span>
                </button>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>
