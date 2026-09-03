<script setup lang="ts">
import { computed } from 'vue';
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import type { MenuEntry } from '../../Menu/types';
import { prepareMenuEntries } from '../../Menu/utils';
import Menu from '../Menu/Menu.vue';
import { OverflowIcon } from './icons';
const props = defineProps<{ entries: MenuEntry[]; 'aria-label'?: string; disabled?: boolean }>();
const emit = defineEmits<{ action: [string] }>();
const prepared = computed(() => prepareMenuEntries(props.entries));
</script>
<template>
  <div :class="styles.moreWrap">
    <Menu :entries="prepared" layout="large" :dim-background="false" @entry-select="(e) => emit('action', e.id)">
      <button type="button" :aria-label="props['aria-label'] ?? 'More'" :disabled="disabled"><OverflowIcon /></button>
    </Menu>
  </div>
</template>
