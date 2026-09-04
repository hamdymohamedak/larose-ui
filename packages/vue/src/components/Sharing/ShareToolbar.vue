<script setup lang="ts">
import { ref } from 'vue';
import type { CollaborationAction, Collaborator, ShareDestination, SharePermissionOption, ShareSettings } from '../../Sharing/types';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';
import ShareButton from './ShareButton.vue';
import ShareSheet from './ShareSheet.vue';
import CollaborationButton from './CollaborationButton.vue';
import CollaborationPopover from './CollaborationPopover.vue';

const props = withDefaults(defineProps<{
  shareTitle?: string; collaborating?: boolean; collaborators?: Collaborator[];
  shareSettings?: ShareSettings; destinations?: ShareDestination[]; permissionOptions?: SharePermissionOption[];
  collaborationActions?: CollaborationAction[]; manageLabel?: string; class?: string; style?: Record<string, string | number>;
}>(), {
  shareTitle: 'Share Document',
  collaborating: false,
  collaborators: () => [],
  shareSettings: () => ({ audience: 'invited', permission: 'edit' }),
  destinations: () => [{ id: 'copy-link', label: 'Copy Link' }, { id: 'copy', label: 'Send Copy' }, { id: 'messages', label: 'Messages' }],
});

const emit = defineEmits<{ shareSettingsChange: [ShareSettings]; manage: []; message: []; video: [] }>();
const shareOpen = ref(false);
const settings = ref(props.shareSettings);
</script>

<template>
  <div :class="cn(styles.toolbar, props.class)" :style="props.style">
    <ShareButton @click="shareOpen = true" />
    <CollaborationPopover v-if="collaborating" :collaborators="collaborators" :actions="collaborationActions" :manage-label="manageLabel" @manage="emit('manage')" @message="emit('message')" @video="emit('video')">
      <template #trigger><CollaborationButton :collaborators="collaborators" /></template>
    </CollaborationPopover>
    <slot />
    <ShareSheet :open="shareOpen" :title="shareTitle" :settings="settings" :destinations="destinations" :permission-options="permissionOptions" @close="shareOpen = false" @settings-change="settings = $event; emit('shareSettingsChange', $event)" />
  </div>
</template>
