<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import type { CSSProperties } from 'vue';
import type { ContextMenuEntry, ContextMenuItemConfig } from '../../ContextMenu/types';
import { canShowDisabledItem, isItem } from '../../ContextMenu/utils';
import type { DockWindow } from '../../DockMenu/types';
import { buildDockMenuEntries, resolveDockMenuPosition } from '../../DockMenu/utils';
import styles from '@larose-ui/styles/components/DockMenu/DockMenu.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    appName: string;
    isRunning?: boolean;
    openWindows?: DockWindow[];
    runningEntries?: ContextMenuEntry[];
    closedEntries?: ContextMenuEntry[];
    open?: boolean;
    class?: string;
    style?: CSSProperties;
  }>(),
  {
    isRunning: true,
    openWindows: () => [],
    runningEntries: () => [],
    closedEntries: () => [],
  },
);

const emit = defineEmits<{
  'update:open': [boolean];
  openChange: [boolean];
  windowSelect: [DockWindow];
  entrySelect: [ContextMenuItemConfig];
}>();

const menuId = useId();
const iconRef = ref<HTMLButtonElement | null>(null);
const internalOpen = ref(false);
const position = ref({ x: 0, y: 0 });
const isOpen = computed(() => (props.open !== undefined ? props.open : internalOpen.value));

const preparedEntries = computed(() =>
  buildDockMenuEntries({
    isRunning: props.isRunning,
    openWindows: props.openWindows,
    runningEntries: props.runningEntries,
    closedEntries: props.closedEntries,
    onWindowSelect: (window) => emit('windowSelect', window),
  }),
);

function setOpen(next: boolean) {
  if (props.open === undefined) internalOpen.value = next;
  emit('update:open', next);
  emit('openChange', next);
}

function openAboveIcon() {
  const rect = iconRef.value?.getBoundingClientRect();
  if (!rect) return;
  const menuWidth = 240;
  const menuHeight = Math.min(360, 16 + preparedEntries.value.length * 36);
  position.value = resolveDockMenuPosition(rect, menuWidth, menuHeight);
  setOpen(true);
}

function close() {
  setOpen(false);
}

function handleSelect(entry: ContextMenuItemConfig) {
  if (entry.disabled && canShowDisabledItem(entry)) return;
  entry.onSelect?.();
  emit('entrySelect', entry);
  close();
}

let keyHandler: ((event: KeyboardEvent) => void) | null = null;

watch(isOpen, (open) => {
  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }
  if (!open) return;
  keyHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  document.addEventListener('keydown', keyHandler);
});

onBeforeUnmount(() => {
  if (keyHandler) document.removeEventListener('keydown', keyHandler);
});
</script>

<template>
  <button
    ref="iconRef"
    type="button"
    :class="cn(styles.iconButton, props.class)"
    :style="props.style"
    :aria-label="appName"
    aria-haspopup="menu"
    :aria-expanded="isOpen"
    :aria-controls="isOpen ? menuId : undefined"
    :data-running="isRunning ? 'true' : undefined"
    :data-active="isOpen ? 'true' : undefined"
    @contextmenu.prevent="openAboveIcon"
  >
    <span :class="styles.iconImage">
      <slot name="icon" />
    </span>
  </button>

  <Teleport to="[data-lr-portal-root], [data-lr-provider], body">
    <div v-if="isOpen">
      <div :class="styles.menuBackdrop" role="presentation" @click="close" />
      <div
        :id="menuId"
        :class="styles.menu"
        role="menu"
        :aria-label="`${appName} Dock menu`"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: 'fixed',
          zIndex: 1000,
        }"
        @click.stop
      >
        <ul :class="styles.list">
          <template
            v-for="(entry, index) in preparedEntries"
            :key="('id' in entry && entry.id) || `sep-${index}`"
          >
            <li v-if="entry.type === 'separator'" :class="styles.separator" role="separator" />
            <li v-else-if="isItem(entry)">
              <button
                type="button"
                :class="styles.item"
                role="menuitem"
                :data-destructive="entry.destructive ? 'true' : undefined"
                :disabled="Boolean(entry.disabled && canShowDisabledItem(entry))"
                @click="handleSelect(entry)"
              >
                <span v-if="entry.icon" :class="styles.icon" />
                <span :class="styles.label">{{ entry.label }}</span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
