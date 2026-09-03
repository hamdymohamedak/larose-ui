<script setup lang="ts">
import { computed } from 'vue';
import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
import { prepareMenuEntries } from '../../Menu/utils';
import { resolveDynamicMenuEntries } from '../../MenuBar/utils';
import styles from '@larose-ui/styles/components/MenuBar/MenuBar.module.css';
import { cn } from '../../utils/cn';
import Menu from '../Menu/Menu.vue';

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    entries: MenuEntry[];
    open?: boolean;
    optionKey?: boolean;
    mnemonicVisible?: boolean;
    enableTypeAhead?: boolean;
    enableMnemonics?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  {
    optionKey: false,
    mnemonicVisible: false,
    enableTypeAhead: true,
    enableMnemonics: true,
  },
);

const emit = defineEmits<{
  'update:open': [boolean];
  openChange: [boolean];
  action: [MenuItemConfig];
}>();

const prepared = computed(() =>
  resolveDynamicMenuEntries(prepareMenuEntries(props.entries), {
    optionKey: props.optionKey,
  }),
);
</script>

<template>
  <Menu
    :entries="prepared"
    :open="open"
    layout="large"
    :dim-background="false"
    :option-key="optionKey"
    :enable-type-ahead="enableTypeAhead"
    :enable-mnemonics="enableMnemonics"
    :mnemonic-visible="mnemonicVisible"
    :class="cn(props.class)"
    :style="props.style"
    @open-change="emit('update:open', $event); emit('openChange', $event)"
    @entry-select="emit('action', $event)"
  >
    <button
      type="button"
      :class="styles.extraButton"
      :aria-label="label"
      :data-extra-id="id"
    >
      <slot name="icon" />
    </button>
  </Menu>
</template>
