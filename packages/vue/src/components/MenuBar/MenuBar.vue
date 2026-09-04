<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { detectPlatform } from '@larose-ui/core';
import { collectMenuBarMnemonicBindings } from '../../accelerator/mnemonic';
import type {
  MenuBarExtraConfig,
  MenuBarMenuConfig,
  MenuBarPlatform,
  StandardMenuBarOptions,
} from '../../MenuBar/types';
import {
  buildStandardMenuBar,
  createAppleMenuStub,
  resolveDynamicMenuEntries,
} from '../../MenuBar/utils';
import { prepareMenuEntries } from '../../Menu/utils';
import type { MenuItemConfig } from '../../Menu/types';
import styles from '@larose-ui/styles/components/MenuBar/MenuBar.module.css';
import { cn } from '../../utils/cn';
import { useMenuBarAccelerators } from '../../composables/useAccelerator';
import Menu from '../Menu/Menu.vue';
import MnemonicLabel from '../Accelerator/MnemonicLabel.vue';
import MenuBarExtra from './MenuBarExtra.vue';

const props = withDefaults(
  defineProps<{
    appName: string;
    menus?: MenuBarMenuConfig[];
    standardOptions?: StandardMenuBarOptions;
    appSpecificMenus?: MenuBarMenuConfig[];
    extras?: MenuBarExtraConfig[];
    platform?: MenuBarPlatform;
    revealed?: boolean;
    showAppleMenu?: boolean;
    enableGlobalShortcuts?: boolean;
    enableTypeAhead?: boolean;
    enableMnemonics?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  {
    appSpecificMenus: () => [],
    extras: () => [],
    platform: 'macos',
    enableGlobalShortcuts: true,
    enableTypeAhead: true,
  },
);

const emit = defineEmits<{
  revealChange: [boolean];
  menuAction: [string, string];
}>();

const openMenuId = ref<string | null>(null);
const optionKey = ref(false);
const altKeyHeld = ref(false);
const internalRevealed = ref(props.platform !== 'ipados');
const runtimePlatform = detectPlatform();
const mnemonicsEnabled = computed(
  () => props.enableMnemonics ?? runtimePlatform !== 'macos',
);
const mnemonicVisible = computed(
  () => mnemonicsEnabled.value && altKeyHeld.value && runtimePlatform !== 'macos',
);
const isRevealed = computed(() => props.revealed ?? internalRevealed.value);
const showApple = computed(
  () => (props.showAppleMenu ?? props.platform === 'macos') && props.platform === 'macos',
);

const menus = computed(
  () =>
    props.menus ??
    buildStandardMenuBar({
      appName: props.appName,
      platform: props.platform,
      appSpecificMenus: props.appSpecificMenus,
      ...props.standardOptions,
    }),
);

const allMenus = computed(() => {
  const list = [...menus.value];
  if (showApple.value) {
    list.unshift({
      id: 'apple',
      title: 'Apple',
      ariaLabel: 'Apple menu',
      entries: createAppleMenuStub(),
    });
  }
  return list;
});

const appleMenu = computed(
  (): MenuBarMenuConfig => ({
    id: 'apple',
    title: 'Apple',
    ariaLabel: 'Apple menu',
    entries: createAppleMenuStub(),
  }),
);

const menuBarMnemonics = computed(() => collectMenuBarMnemonicBindings(allMenus.value));
const acceleratorMenus = computed(() => allMenus.value.filter((menu) => menu.id !== 'apple'));

useMenuBarAccelerators({
  menus: acceleratorMenus,
  optionKey,
  enableGlobalShortcuts: props.enableGlobalShortcuts,
  onMenuAction: (menuId, entry) => {
    entry.onSelect?.();
    emit('menuAction', menuId, entry.id);
  },
});

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Alt') {
    altKeyHeld.value = true;
    if (props.platform === 'macos') optionKey.value = true;
  }
  if (mnemonicsEnabled.value && runtimePlatform !== 'macos' && event.altKey && !openMenuId.value) {
    const key = event.key.length === 1 ? event.key.toLowerCase() : '';
    if (!key) return;
    const binding = menuBarMnemonics.value.find((entry) => entry.mnemonicKey === key);
    if (binding) {
      event.preventDefault();
      openMenuId.value = binding.menuId;
    }
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'Alt') {
    altKeyHeld.value = false;
    if (props.platform === 'macos') optionKey.value = false;
  }
}

function onBlur() {
  altKeyHeld.value = false;
  if (props.platform === 'macos') optionKey.value = false;
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown, true);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('blur', onBlur);
});

function preparedEntries(menu: MenuBarMenuConfig) {
  return resolveDynamicMenuEntries(prepareMenuEntries(menu.entries), {
    optionKey: optionKey.value,
  });
}

function handleAction(menuId: string, entry: MenuItemConfig) {
  entry.onSelect?.();
  emit('menuAction', menuId, entry.id);
}

function revealFromEdge() {
  if (props.platform === 'ipados') {
    internalRevealed.value = true;
    emit('revealChange', true);
  }
}

function hideWhenPointerLeaves() {
  if (props.platform === 'ipados' && props.revealed === undefined) {
    internalRevealed.value = false;
  }
}
</script>

<template>
  <div
    v-if="platform === 'ipados'"
    :class="styles.revealZone"
    role="presentation"
    aria-hidden="true"
    @pointerenter="revealFromEdge"
  />
  <header
    role="menubar"
    :aria-label="`${appName} menu bar`"
    :class="cn(styles.menuBar, props.class)"
    :style="props.style"
    :data-platform="platform"
    :data-hidden="platform === 'ipados' ? (!isRevealed).toString() : undefined"
    @pointerenter="revealFromEdge"
    @pointerleave="hideWhenPointerLeaves"
  >
    <div :class="styles.leading">
      <Menu
        v-if="showApple"
        :entries="preparedEntries(appleMenu)"
        :open="openMenuId === 'apple'"
        layout="large"
        :dim-background="false"
        :option-key="optionKey"
        :enable-type-ahead="enableTypeAhead"
        :enable-mnemonics="mnemonicsEnabled"
        :mnemonic-visible="mnemonicVisible"
        @open-change="openMenuId = $event ? 'apple' : null"
      >
        <button type="button" :class="styles.menuTitle" aria-label="Apple menu">
          <span :class="styles.appleMark" aria-hidden="true">{{ '\uF8FF' }}</span>
        </button>
      </Menu>
      <Menu
        v-for="menu in menus"
        :key="menu.id"
        :entries="preparedEntries(menu)"
        :open="openMenuId === menu.id"
        layout="large"
        :dim-background="false"
        :option-key="optionKey"
        :enable-type-ahead="enableTypeAhead"
        :enable-mnemonics="mnemonicsEnabled"
        :mnemonic-visible="mnemonicVisible"
        @open-change="openMenuId = $event ? menu.id : null"
        @entry-select="handleAction(menu.id, $event)"
      >
        <button
          type="button"
          :class="styles.menuTitle"
          :data-emphasized="menu.emphasized ? 'true' : undefined"
          :data-menu-id="menu.id"
          :aria-label="menu.ariaLabel"
        >
          <MnemonicLabel
            :label="menu.title"
            :mnemonic="menu.mnemonic"
            :show-access-key="mnemonicVisible"
          />
        </button>
      </Menu>
    </div>
    <div
      v-if="extras.length"
      :class="styles.trailing"
      role="group"
      aria-label="Menu bar extras"
    >
      <MenuBarExtra
        v-for="extra in extras"
        :key="extra.id"
        :id="extra.id"
        :label="extra.label"
        :entries="extra.entries"
        :open="openMenuId === extra.id"
        :option-key="optionKey"
        :mnemonic-visible="mnemonicVisible"
        :enable-type-ahead="enableTypeAhead"
        :enable-mnemonics="mnemonicsEnabled"
        @open-change="openMenuId = $event ? extra.id : null"
        @action="handleAction(extra.id, $event)"
      >
        <template #icon>
          <component :is="extra.icon" v-if="extra.icon" />
        </template>
      </MenuBarExtra>
    </div>
  </header>
</template>
