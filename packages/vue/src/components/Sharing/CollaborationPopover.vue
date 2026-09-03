<script setup lang="ts">
import { computed, onUnmounted, ref, useId, watch } from 'vue';
import type { CollaborationAction, Collaborator } from '../../Sharing/types';
import { collaboratorInitials } from '../../Sharing/utils';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';
import { MessageIcon, VideoIcon } from './icons';

const props = withDefaults(defineProps<{
  collaborators: Collaborator[]; actions?: CollaborationAction[]; manageLabel?: string;
  open?: boolean; defaultOpen?: boolean; class?: string; style?: Record<string, string | number>;
}>(), { actions: () => [], manageLabel: 'Manage Shared File', defaultOpen: false });

const emit = defineEmits<{ 'update:open': [boolean]; openChange: [boolean]; manage: []; message: []; video: [] }>();
const internal = ref(props.defaultOpen);
const isOpen = computed(() => (props.open !== undefined ? props.open : internal.value));
const popoverId = useId();
const rootRef = ref<HTMLElement | null>(null);

function setOpen(next: boolean) {
  if (props.open === undefined) internal.value = next;
  emit('update:open', next);
  emit('openChange', next);
}

watch(isOpen, (open) => {
  if (!open) return;
  const onPointer = (e: MouseEvent) => { if (!rootRef.value?.contains(e.target as Node)) setOpen(false); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
  document.addEventListener('mousedown', onPointer);
  document.addEventListener('keydown', onKey);
  onUnmounted(() => { document.removeEventListener('mousedown', onPointer); document.removeEventListener('keydown', onKey); });
});
</script>

<template>
  <span ref="rootRef" :class="cn(styles.wrapper, props.class)" :style="props.style">
    <span :aria-expanded="isOpen" :aria-controls="isOpen ? popoverId : undefined" @click="setOpen(!isOpen)"><slot name="trigger" /></span>
    <div v-if="isOpen" :id="popoverId" role="dialog" aria-label="Collaboration" :class="styles.popover" data-side="bottom" data-align="end">
      <div :class="styles.section">
        <div v-for="person in collaborators" :key="person.id" :class="styles.collaboratorRow">
          <span :class="styles.avatar" aria-hidden="true">
            <img v-if="person.avatarUrl" :src="person.avatarUrl" alt="" />
            <template v-else>{{ person.initials ?? collaboratorInitials(person.name) }}</template>
          </span>
          <span :class="styles.collaboratorName">{{ person.name }}</span>
        </div>
        <div :class="styles.communicationRow">
          <button type="button" :class="styles.commButton" @click="emit('message')"><MessageIcon /> Messages</button>
          <button type="button" :class="styles.commButton" @click="emit('video')"><VideoIcon /> FaceTime</button>
        </div>
      </div>
      <div v-if="actions.length" :class="styles.section">
        <button v-for="action in actions" :key="action.id" type="button" :class="styles.actionButton" @click="action.onSelect?.(); setOpen(false)">
          <span :class="styles.optionLabel">{{ action.label }}</span>
          <span v-if="action.description" :class="styles.optionDescription">{{ action.description }}</span>
        </button>
      </div>
      <div :class="styles.section">
        <button type="button" :class="styles.manageButton" @click="emit('manage'); setOpen(false)">{{ manageLabel }}</button>
      </div>
    </div>
  </span>
</template>
