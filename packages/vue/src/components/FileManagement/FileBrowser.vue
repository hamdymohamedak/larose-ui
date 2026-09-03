<script setup lang="ts">
import { computed } from 'vue';
import type { FileBrowserItem, FileBrowserTab, FileSyncStatus } from '../../FileManagement/types';
import { formatDisplayName, formatFileDate, formatFileSize, filterFilesByTab, filterFilesByType } from '../../FileManagement/utils';
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';
import { cn } from '../../utils/cn';
import { DocumentIcon } from './icons';

const props = withDefaults(defineProps<{
  files: FileBrowserItem[]; activeTab?: FileBrowserTab; showExtensions?: boolean; selectedId?: string;
  acceptTypes?: string[]; emptyLabel?: string; class?: string; style?: Record<string, string | number>;
}>(), { activeTab: 'recents', showExtensions: false, emptyLabel: 'No documents in this location.' });

const emit = defineEmits<{
  tabChange: [FileBrowserTab];
  showExtensionsChange: [boolean];
  select: [FileBrowserItem];
  open: [FileBrowserItem];
}>();

const tabs = [
  { id: 'recents' as const, label: 'Recents' },
  { id: 'shared' as const, label: 'Shared' },
  { id: 'browse' as const, label: 'Browse' },
];

const visible = computed(() => filterFilesByType(filterFilesByTab(props.files, props.activeTab), props.acceptTypes));

function syncLabel(status?: FileSyncStatus) {
  switch (status) {
    case 'synced': return 'Synced';
    case 'syncing': return 'Syncing';
    case 'error': return 'Sync error';
    case 'offline': return 'Offline';
    default: return '';
  }
}
</script>

<template>
  <section :class="cn(styles.browser, props.class)" :style="props.style" aria-label="File browser">
    <div :class="styles.browserHeader">
      <div :class="styles.tabList" role="tablist" aria-label="File locations">
        <button v-for="tab in tabs" :key="tab.id" type="button" role="tab" :aria-selected="activeTab === tab.id" :class="styles.tab" :data-active="activeTab === tab.id ? 'true' : undefined" @click="emit('tabChange', tab.id)">{{ tab.label }}</button>
      </div>
      <div :class="styles.browserControls">
        <label :class="styles.toggleLabel">
          <input type="checkbox" :checked="showExtensions" @change="emit('showExtensionsChange', ($event.target as HTMLInputElement).checked)" />
          Show extensions
        </label>
        <slot name="toolbar" />
      </div>
    </div>
    <div v-if="!visible.length" :class="styles.emptyState">{{ emptyLabel }}</div>
    <ul v-else :class="styles.fileList" role="listbox" aria-label="Documents">
      <li
        v-for="file in visible"
        :key="file.id"
        role="option"
        :aria-selected="selectedId === file.id"
        :class="styles.fileRow"
        :data-selected="selectedId === file.id ? 'true' : undefined"
        @click="emit('select', file)"
        @dblclick="emit('open', file)"
      >
        <span :class="styles.fileIcon">
          <img v-if="file.thumbnailUrl" :src="file.thumbnailUrl" alt="" width="20" height="20" />
          <DocumentIcon v-else />
        </span>
        <div :class="styles.fileMeta">
          <span :class="styles.fileName">{{ formatDisplayName(file.name, showExtensions) }}</span>
          <span :class="styles.fileDetails">{{ [formatFileSize(file.size), formatFileDate(file.modifiedAt), file.location === 'icloud' ? 'iCloud' : file.location === 'remote' ? 'Remote' : 'On My Device'].filter(Boolean).join(' · ') }}</span>
        </div>
        <span v-if="file.syncStatus" :class="styles.syncBadge" :data-status="file.syncStatus" :title="syncLabel(file.syncStatus)" :aria-label="syncLabel(file.syncStatus)" />
      </li>
    </ul>
  </section>
</template>
