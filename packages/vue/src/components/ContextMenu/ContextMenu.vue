<script setup lang="ts">
import { computed, onUnmounted, ref, useId, watch } from 'vue';
import type { ContextMenuEntry, ContextMenuItemConfig } from '../../ContextMenu/types';
import { isItem, isSubmenu, LONG_PRESS_MS, prepareContextMenuEntries, resolveMenuPosition, warnIfTooManyGroups } from '../../ContextMenu/utils';
import styles from '@larose-ui/styles/components/ContextMenu/ContextMenu.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(defineProps<{
  entries: ContextMenuEntry[];
  title?: string;
  open?: boolean;
  longPress?: boolean;
  dimBackground?: boolean;
  class?: string;
  style?: Record<string, string | number>;
}>(), { longPress: true, dimBackground: true });

const emit = defineEmits<{ 'update:open': [boolean]; openChange: [boolean]; entrySelect: [ContextMenuItemConfig] }>();
const menuId = useId();
const internalOpen = ref(false);
const position = ref({ x: 0, y: 0, placement: 'below' as const });
const activeSubmenu = ref<string | null>(null);
const longPressTimer = ref<number | null>(null);
const isOpen = computed(() => (props.open !== undefined ? props.open : internalOpen.value));
const prepared = computed(() => prepareContextMenuEntries(props.entries));
watch(prepared, (e) => warnIfTooManyGroups(e), { immediate: true });

function setOpen(next: boolean) {
  if (props.open === undefined) internalOpen.value = next;
  emit('update:open', next);
  emit('openChange', next);
}
function openAt(x: number, y: number) {
  const menuWidth = 240;
  const menuHeight = Math.min(360, 48 + prepared.value.length * 36);
  position.value = resolveMenuPosition(x, y, menuWidth, menuHeight, window.innerWidth, window.innerHeight) as typeof position.value;
  setOpen(true);
}
function close() { setOpen(false); activeSubmenu.value = null; }
function handleSelect(entry: ContextMenuItemConfig) {
  entry.onSelect?.();
  emit('entrySelect', entry);
  close();
}
function clearLongPress() {
  if (longPressTimer.value !== null) {
    window.clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
}
function onContextMenu(event: MouseEvent) {
  event.preventDefault();
  openAt(event.clientX, event.clientY);
}
function onPointerDown(event: PointerEvent) {
  if (!props.longPress || event.pointerType === 'mouse') return;
  clearLongPress();
  longPressTimer.value = window.setTimeout(() => openAt(event.clientX, event.clientY), LONG_PRESS_MS);
}
watch(isOpen, (open) => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
  if (open) document.addEventListener('keydown', onKey);
  else document.removeEventListener('keydown', onKey);
  onUnmounted(() => document.removeEventListener('keydown', onKey));
});
</script>

<template>
  <span :class="cn(styles.triggerWrap, props.class)" :style="props.style" @contextmenu="onContextMenu" @pointerdown="onPointerDown" @pointerup="clearLongPress" @pointercancel="clearLongPress" @pointerleave="clearLongPress">
    <slot />
  </span>
  <Teleport to="[data-lr-portal-root], [data-lr-provider], body">
    <div v-if="isOpen">
      <div v-if="dimBackground" :class="styles.menuBackdrop" @click="close" />
      <div :id="menuId" :class="styles.menu" role="menu" :aria-label="title ?? 'Context menu'" :style="{ left: `${position.x}px`, top: `${position.y}px`, position: 'fixed', zIndex: 1000 }" @click.stop>
        <p v-if="title" :class="styles.title">{{ title }}</p>
        <div v-if="$slots.preview" :class="styles.preview"><slot name="preview" /></div>
        <ul :class="styles.list">
          <template v-for="(entry, index) in prepared" :key="(entry as any).id ?? `sep-${index}`">
            <li v-if="entry.type === 'separator'" :class="styles.separator" role="separator" />
            <li v-else-if="isSubmenu(entry)" :class="styles.submenuWrap">
              <button type="button" :class="styles.submenuTrigger" role="menuitem" aria-haspopup="menu" :aria-expanded="activeSubmenu === entry.id" @mouseenter="activeSubmenu = entry.id" @focus="activeSubmenu = entry.id">
                <span :class="styles.label">{{ entry.label }}</span>
                <span :class="styles.submenuChevron" aria-hidden="true">›</span>
              </button>
              <ul v-if="activeSubmenu === entry.id" :class="styles.submenu" role="menu" :aria-label="entry.label">
                <li v-for="item in entry.items" :key="item.id">
                  <button type="button" :class="styles.item" role="menuitem" :data-destructive="item.destructive ? 'true' : undefined" :disabled="item.disabled" @click="handleSelect(item)">
                    <span :class="styles.label">{{ item.label }}</span>
                  </button>
                </li>
              </ul>
            </li>
            <li v-else-if="isItem(entry)">
              <button type="button" :class="styles.item" role="menuitem" :data-destructive="entry.destructive ? 'true' : undefined" :disabled="entry.disabled" @click="handleSelect(entry)">
                <span :class="styles.label">{{ entry.label }}</span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
