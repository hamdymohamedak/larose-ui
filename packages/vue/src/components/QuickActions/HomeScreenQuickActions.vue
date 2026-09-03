<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import { LONG_PRESS_MS } from '../../ContextMenu/utils';
import type { QuickActionIconPlacement, QuickActionItem } from '../../QuickActions/types';
import { estimateQuickActionMenuHeight, prepareQuickActions, resolveQuickActionMenuPosition } from '../../QuickActions/utils';
import styles from '@larose-ui/styles/components/QuickActions/QuickActions.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(defineProps<{
  appName: string; actions: QuickActionItem[]; iconPlacement?: QuickActionIconPlacement;
  includeSystemActions?: boolean; systemActions?: QuickActionItem[]; open?: boolean;
  class?: string; style?: Record<string, string | number>;
}>(), { iconPlacement: 'leading', includeSystemActions: true });

const emit = defineEmits<{ 'update:open': [boolean]; openChange: [boolean]; actionSelect: [QuickActionItem] }>();
const menuId = useId();
const iconRef = ref<HTMLElement | null>(null);
const longPressTimer = ref<number | null>(null);
const internal = ref(false);
const position = ref({ x: 0, y: 0 });
const isOpen = computed(() => (props.open !== undefined ? props.open : internal.value));
const prepared = computed(() => prepareQuickActions(props.actions, { includeSystemActions: props.includeSystemActions, systemActions: props.systemActions }));
const appActions = computed(() => prepared.value.filter((a) => !a.system));
const systemGroup = computed(() => prepared.value.filter((a) => a.system));

function setOpen(next: boolean) { if (props.open === undefined) internal.value = next; emit('update:open', next); emit('openChange', next); }
function openAbove() {
  const rect = iconRef.value?.getBoundingClientRect();
  if (!rect) return;
  position.value = resolveQuickActionMenuPosition(rect, 260, estimateQuickActionMenuHeight(prepared.value.length));
  setOpen(true);
}
function close() { setOpen(false); }
function clear() { if (longPressTimer.value !== null) { window.clearTimeout(longPressTimer.value); longPressTimer.value = null; } }
function select(action: QuickActionItem) { action.onSelect?.(); emit('actionSelect', action); close(); }
function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse') return;
  clear();
  longPressTimer.value = window.setTimeout(openAbove, LONG_PRESS_MS);
}
</script>

<template>
  <div :class="cn(styles.quickActionsWrap, props.class)" :style="props.style">
    <div
      ref="iconRef"
      :class="styles.appIcon"
      role="button"
      tabindex="0"
      :aria-label="appName"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @pointerdown="onPointerDown"
      @pointerup="clear" @pointercancel="clear" @pointerleave="clear"
      @contextmenu.prevent="openAbove"
    ><slot name="icon" /></div>
    <span :class="styles.hint">Touch and hold for quick actions</span>
    <Teleport to="[data-lr-portal-root], [data-lr-provider], body">
      <div v-if="isOpen">
        <div :class="styles.menuBackdrop" @click="close" />
        <div :id="menuId" :class="styles.menu" role="menu" :aria-label="`${appName} quick actions`" :style="{ left: `${position.x}px`, top: `${position.y}px`, position: 'fixed', zIndex: 1000 }" @click.stop>
          <ul :class="styles.list">
            <li v-for="action in appActions" :key="action.id">
              <button type="button" :class="styles.row" role="menuitem" :data-icon-placement="iconPlacement" :data-destructive="action.destructive ? 'true' : undefined" :disabled="action.disabled" @click="select(action)">
                <span :class="styles.textBlock"><span :class="styles.title">{{ action.label }}</span><span v-if="action.subtitle" :class="styles.subtitle">{{ action.subtitle }}</span></span>
              </button>
            </li>
            <li v-if="systemGroup.length" :class="styles.systemGroup" role="presentation">
              <ul :class="styles.list">
                <li v-for="action in systemGroup" :key="action.id">
                  <button type="button" :class="styles.row" role="menuitem" :data-icon-placement="iconPlacement" :disabled="action.disabled" @click="select(action)">
                    <span :class="styles.textBlock"><span :class="styles.title">{{ action.label }}</span></span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </Teleport>
  </div>
</template>
