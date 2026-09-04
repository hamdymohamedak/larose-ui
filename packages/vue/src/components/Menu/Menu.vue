<script setup lang="ts">
import { computed, onUnmounted, ref, useId, useSlots, watch } from 'vue';
import type { MenuEntry, MenuItemConfig, MenuLayout } from '../../Menu/types';
import {
  isMenuItem,
  isMenuSubmenu,
  prepareMenuEntries,
  resolveMenuPanelPosition,
  splitCompactAndList,
} from '../../Menu/utils';
import { resolveMenuShortcut } from '../../accelerator/resolveMenuShortcut';
import styles from '@larose-ui/styles/components/Menu/Menu.module.css';
import { cn } from '../../utils/cn';
import { useLaRosePortalTarget } from '../../composables/useLaRosePortalTarget';
import MnemonicLabel from '../Accelerator/MnemonicLabel.vue';

const props = withDefaults(
  defineProps<{
    entries: MenuEntry[];
    layout?: MenuLayout;
    title?: string;
    open?: boolean;
    dimBackground?: boolean;
    enableShortcuts?: boolean;
    optionKey?: boolean;
    enableTypeAhead?: boolean;
    enableMnemonics?: boolean;
    mnemonicVisible?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  {
    layout: 'large',
    dimBackground: true,
    enableShortcuts: true,
    enableTypeAhead: true,
    enableMnemonics: true,
    mnemonicVisible: false,
  },
);

const emit = defineEmits<{
  'update:open': [boolean];
  openChange: [boolean];
  entrySelect: [MenuItemConfig];
}>();

const slots = useSlots();
const portalTarget = useLaRosePortalTarget();
const menuId = useId();
const triggerRef = ref<HTMLElement | null>(null);
const internalOpen = ref(false);
const position = ref({ x: 0, y: 0, placement: 'below' as const });
const activeSubmenu = ref<string | null>(null);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => (isControlled.value ? Boolean(props.open) : internalOpen.value));
const prepared = computed(() => prepareMenuEntries(props.entries));
const split = computed(() => splitCompactAndList(prepared.value, props.layout));
const hasTrigger = computed(() => Boolean(slots.default));

function estimateHeight() {
  return Math.min(420, 48 + prepared.value.length * 36 + (props.layout !== 'large' ? 64 : 0));
}

function estimateWidth() {
  return props.layout === 'large' ? 240 : 280;
}

function centerOnViewport() {
  const menuWidth = estimateWidth();
  const menuHeight = estimateHeight();
  position.value = {
    x: Math.max(16, (window.innerWidth - menuWidth) / 2),
    y: Math.max(16, (window.innerHeight - menuHeight) / 2),
    placement: 'below',
  };
}

function positionFromTrigger() {
  const rect = triggerRef.value?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
  position.value = resolveMenuPanelPosition(
    rect,
    estimateWidth(),
    estimateHeight(),
  ) as typeof position.value;
}

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit('update:open', next);
  emit('openChange', next);
}

function openFromTrigger() {
  positionFromTrigger();
  setOpen(true);
}

function close() {
  setOpen(false);
  activeSubmenu.value = null;
}

function handleSelect(entry: MenuItemConfig) {
  entry.onSelect?.();
  emit('entrySelect', entry);
  close();
}

function onKeyDown(event: KeyboardEvent) {
  if (!isOpen.value) return;
  if (event.key === 'Escape') close();
}

watch(isOpen, (open) => {
  if (open) {
    if (!hasTrigger.value) centerOnViewport();
    else if (isControlled.value) positionFromTrigger();
    document.addEventListener('keydown', onKeyDown);
  } else {
    document.removeEventListener('keydown', onKeyDown);
  }
});
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <span
    v-if="hasTrigger"
    ref="triggerRef"
    :class="cn(styles.triggerWrap, props.class)"
    :style="props.style"
    @click="openFromTrigger"
  >
    <slot />
  </span>
  <Teleport :to="portalTarget">
    <div v-if="isOpen">
      <div v-if="dimBackground" :class="styles.menuBackdrop" @click="close" />
      <div
        :id="menuId"
        :class="styles.menu"
        role="menu"
        aria-label="Menu"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: 'fixed',
          zIndex: 1000,
          ...props.style,
        }"
        @click.stop
      >
        <p v-if="title" :class="styles.menuTitle">{{ title }}</p>
        <div
          v-if="split.compact.length"
          :class="styles.compactRow"
          role="group"
          aria-label="Primary actions"
        >
          <button
            v-for="item in split.compact"
            :key="item.id"
            type="button"
            :class="styles.compactTile"
            :data-layout="layout"
            :disabled="item.disabled"
            :aria-label="layout === 'small' ? item.label : undefined"
            @click="handleSelect(item)"
          >
            <span v-if="item.icon" :class="styles.compactIcon">
              <component :is="item.icon" v-if="typeof item.icon === 'object'" />
              <template v-else>{{ item.icon }}</template>
            </span>
            <span v-if="layout === 'medium'" :class="styles.compactLabel">{{ item.label }}</span>
          </button>
        </div>
        <ul :class="styles.list">
          <template v-for="(entry, index) in split.list" :key="(entry as any).id ?? `sep-${index}`">
            <li v-if="entry.type === 'separator'" :class="styles.separator" role="separator" />
            <li
              v-else-if="isMenuSubmenu(entry)"
              :class="styles.submenuWrap"
              :data-active="activeSubmenu === entry.id ? 'true' : undefined"
            >
              <button
                type="button"
                :class="styles.submenuTrigger"
                role="menuitem"
                aria-haspopup="menu"
                :aria-expanded="activeSubmenu === entry.id"
                :disabled="entry.disabled"
                @mouseenter="activeSubmenu = entry.id"
                @focus="activeSubmenu = entry.id"
              >
                <span :class="styles.checkmark" aria-hidden="true" />
                <MnemonicLabel
                  :label="entry.label"
                  :show-access-key="mnemonicVisible"
                  :class="styles.label"
                />
                <span :class="styles.submenuChevron" aria-hidden="true">›</span>
              </button>
              <ul
                v-if="activeSubmenu === entry.id"
                :class="styles.submenu"
                role="menu"
                :aria-label="entry.label"
                data-side="end"
              >
                <li v-for="item in entry.items" :key="item.id">
                  <button
                    type="button"
                    :class="styles.item"
                    role="menuitem"
                    :data-destructive="item.destructive ? 'true' : undefined"
                    :disabled="item.disabled"
                    @click="handleSelect(item)"
                  >
                    <span :class="styles.checkmark" aria-hidden="true">{{
                      item.selected ? '✓' : ''
                    }}</span>
                    <MnemonicLabel
                      :label="item.label"
                      :mnemonic="item.mnemonic"
                      :show-access-key="mnemonicVisible"
                      :class="styles.label"
                    />
                    <span
                      v-if="resolveMenuShortcut(item, { optionKey }).display"
                      :class="styles.shortcut"
                      dir="ltr"
                    >
                      {{ resolveMenuShortcut(item, { optionKey }).display }}
                    </span>
                  </button>
                </li>
              </ul>
            </li>
            <li v-else-if="isMenuItem(entry)">
              <button
                type="button"
                :class="styles.item"
                role="menuitem"
                :data-destructive="entry.destructive ? 'true' : undefined"
                :disabled="entry.disabled"
                @click="handleSelect(entry)"
              >
                <span :class="styles.checkmark" aria-hidden="true">{{
                  entry.selected ? '✓' : ''
                }}</span>
                <MnemonicLabel
                  :label="entry.label"
                  :mnemonic="entry.mnemonic"
                  :show-access-key="mnemonicVisible"
                  :class="styles.label"
                />
                <span
                  v-if="resolveMenuShortcut(entry, { optionKey }).display"
                  :class="styles.shortcut"
                  dir="ltr"
                >
                  {{ resolveMenuShortcut(entry, { optionKey }).display }}
                </span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
