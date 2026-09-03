<script setup lang="ts">
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';
import { cn } from '../../utils/cn';
import Button from '../Button/Button.vue';
import { PlusIcon } from './icons';

withDefaults(defineProps<{
  newLabel?: string; openLabel?: string; saveLabel?: string; canSave?: boolean; showAddButton?: boolean;
  class?: string; style?: Record<string, string | number>;
}>(), { newLabel: 'New', openLabel: 'Open', saveLabel: 'Save', canSave: true, showAddButton: true });

const emit = defineEmits<{ new: []; open: []; save: [] }>();
</script>

<template>
  <div :class="cn(styles.toolbar, $props.class)" :style="$props.style" role="toolbar" aria-label="Document actions">
    <Button v-if="showAddButton" size="md" shape="roundedRect" :aria-label="newLabel" @click="emit('new')">
      <template #leftIcon><PlusIcon /></template>
      {{ newLabel }}
    </Button>
    <Button size="md" variant="secondary" @click="emit('open')">{{ openLabel }}</Button>
    <Button size="md" variant="secondary" :disabled="!canSave" @click="emit('save')">{{ saveLabel }}</Button>
  </div>
</template>
