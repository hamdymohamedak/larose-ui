<script setup lang="ts">
import { ref, useId, watch } from 'vue';
import type { ShareDestination, SharePermissionOption, ShareSettings } from '../../Sharing/types';
import { formatSharePermissionSummary } from '../../Sharing/utils';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';
import { ChevronRightIcon } from './icons';

const props = withDefaults(defineProps<{
  open: boolean; title?: string; settings: ShareSettings; destinations?: ShareDestination[];
  permissionOptions?: SharePermissionOption[]; class?: string; style?: Record<string, string | number>;
}>(), {
  title: 'Share',
  destinations: () => [],
  permissionOptions: () => [
    { id: 'invited-edit', audience: 'invited', permission: 'edit', label: 'Only invited people', description: 'Can make changes' },
    { id: 'invited-view', audience: 'invited', permission: 'view', label: 'Only invited people', description: 'Can view only' },
    { id: 'everyone-edit', audience: 'everyone', permission: 'edit', label: 'Everyone', description: 'Can make changes' },
    { id: 'everyone-view', audience: 'everyone', permission: 'view', label: 'Everyone', description: 'Can view only' },
  ],
});

const emit = defineEmits<{ close: []; settingsChange: [ShareSettings] }>();
const titleId = useId();
const showPermissions = ref(false);
watch(() => props.open, (open) => {
  if (!open) return;
  showPermissions.value = false;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close'); };
  document.addEventListener('keydown', onKey);
  document.body.style.overflow = 'hidden';
  return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" :class="styles.sheetOverlay" role="presentation" @click.self="emit('close')">
      <div :class="cn(styles.sheet, props.class)" :style="props.style" role="dialog" aria-modal="true" :aria-labelledby="titleId">
        <div :class="styles.sheetHeader">
          <h2 :id="titleId" :class="styles.sheetTitle">{{ title }}</h2>
          <button type="button" :class="styles.permissionSummary" :aria-expanded="showPermissions" @click="showPermissions = !showPermissions">
            <span>{{ formatSharePermissionSummary(settings.audience, settings.permission) }}</span>
            <ChevronRightIcon />
          </button>
        </div>
        <div v-if="showPermissions" :class="styles.permissionPanel" role="group" aria-label="Sharing permissions">
          <button
            v-for="option in permissionOptions"
            :key="option.id"
            type="button"
            :class="styles.option"
            :data-selected="option.audience === settings.audience && option.permission === settings.permission ? 'true' : undefined"
            @click="emit('settingsChange', { ...settings, audience: option.audience, permission: option.permission }); showPermissions = false"
          >
            <span :class="styles.optionLabel">{{ option.label }}</span>
            <span v-if="option.description" :class="styles.optionDescription">{{ option.description }}</span>
          </button>
        </div>
        <div :class="styles.destinations" role="menu" aria-label="Share destinations">
          <button v-for="destination in destinations" :key="destination.id" type="button" :class="styles.destination" role="menuitem" @click="destination.onSelect?.(); emit('close')">
            <span>{{ destination.label }}</span>
          </button>
        </div>
        <div v-if="$slots.footer" :class="styles.section"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
