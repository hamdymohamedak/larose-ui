<script setup lang="ts">
import { computed } from 'vue';
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import type { MenuEntry } from '../../Menu/types';
import { prepareMenuEntries } from '../../Menu/utils';
import Menu from '../Menu/Menu.vue';
import { DocumentMenuIcon } from './icons';
const props = withDefaults(defineProps<{ entries: MenuEntry[]; label?: string; disabled?: boolean }>(), { label: 'Document' });
const emit = defineEmits<{ action: [string] }>();
const prepared = computed(() => prepareMenuEntries(props.entries));
</script>
<template>
  <Menu :entries="prepared" layout="large" :dim-background="false" @entry-select="(e) => emit('action', e.id)">
    <button type="button" :class="styles.item" :aria-label="label" :disabled="disabled">
      <span :class="styles.itemIcon"><DocumentMenuIcon /></span>
    </button>
  </Menu>
</template>
