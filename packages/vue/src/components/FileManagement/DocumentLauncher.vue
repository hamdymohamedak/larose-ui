<script setup lang="ts">
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';
import { cn } from '../../utils/cn';
import Button from '../Button/Button.vue';
import FileBrowser from './FileBrowser.vue';
import type { FileBrowserItem, FileBrowserTab } from '../../FileManagement/types';

withDefaults(defineProps<{
  appTitle: string; files: FileBrowserItem[]; primaryActionLabel?: string; secondaryActionLabel?: string;
  activeTab?: FileBrowserTab; selectedId?: string; class?: string; style?: Record<string, string | number>;
}>(), { primaryActionLabel: 'Create Document', secondaryActionLabel: 'Choose Template' });

const emit = defineEmits<{
  primaryAction: []; secondaryAction: [];
  tabChange: [FileBrowserTab]; select: [FileBrowserItem]; open: [FileBrowserItem];
}>();
</script>

<template>
  <div :class="cn(styles.launcher, $props.class)" :style="$props.style">
    <div :class="styles.launcherHero">
      <slot name="background"><div :class="styles.launcherBackground" aria-hidden="true" /></slot>
      <slot name="accessories" />
      <div :class="styles.launcherContent">
        <h2 :class="styles.launcherTitle">{{ appTitle }}</h2>
        <div :class="styles.launcherActions">
          <Button size="lg" @click="emit('primaryAction')">{{ primaryActionLabel }}</Button>
          <Button size="lg" variant="secondary" @click="emit('secondaryAction')">{{ secondaryActionLabel }}</Button>
        </div>
      </div>
    </div>
    <div :class="styles.launcherSheet">
      <FileBrowser :files="files" :active-tab="activeTab" :selected-id="selectedId" @tab-change="emit('tabChange', $event)" @select="emit('select', $event)" @open="emit('open', $event)" />
    </div>
  </div>
</template>
