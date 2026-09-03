<script setup lang="ts">
import { computed, useId, watch } from 'vue';
import type { ActivityItem, ActivityPresentation } from '../../Sharing/types';
import { partitionActivities, prepareActivities } from '../../Sharing/activityUtils';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(defineProps<{
  open: boolean; activities: ActivityItem[]; excludedActivityIds?: string[]; presentation?: ActivityPresentation;
  title?: string; class?: string; style?: Record<string, string | number>;
}>(), { excludedActivityIds: () => [], presentation: 'sheet' });

const emit = defineEmits<{ close: []; activitySelect: [ActivityItem] }>();
const titleId = useId();
const prepared = computed(() => prepareActivities(props.activities, props.excludedActivityIds));
const parts = computed(() => partitionActivities(prepared.value));

watch(() => props.open, (open) => {
  if (!open) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close'); };
  document.addEventListener('keydown', onKey);
  if (props.presentation === 'sheet') document.body.style.overflow = 'hidden';
  return () => {
    document.removeEventListener('keydown', onKey);
    if (props.presentation === 'sheet') document.body.style.overflow = '';
  };
});

function select(activity: ActivityItem) {
  activity.onSelect?.();
  emit('activitySelect', activity);
  emit('close');
}
</script>

<template>
  <Teleport to="[data-lr-portal-root], [data-lr-provider], body">
    <div v-if="open" :class="presentation === 'popover' ? styles.activityPopoverBackdrop : styles.sheetOverlay" role="presentation" @click.self="emit('close')">
      <div :class="cn(presentation === 'popover' ? styles.activityPopover : styles.activitySheet, props.class)" :style="props.style" role="dialog" aria-modal="true" :aria-labelledby="title ? titleId : undefined" @click.stop>
        <div v-if="title" :class="styles.activityHeader"><h2 :id="titleId" :class="styles.sheetTitle">{{ title }}</h2></div>
        <div v-if="parts.share.length" :class="styles.activityShareRow" role="group" aria-label="Share destinations">
          <button v-for="activity in parts.share" :key="activity.id" type="button" :class="styles.activityShareTile" @click="select(activity)">
            <span :class="styles.activityShareLabel">{{ activity.title }}</span>
            <span v-if="activity.subtitle" :class="styles.activityShareSubtitle">{{ activity.subtitle }}</span>
          </button>
        </div>
        <div v-if="parts.app.length || parts.actions.length" :class="styles.activityActionSection">
          <ul v-if="parts.app.length" :class="styles.activityActionList" role="menu" aria-label="App actions">
            <li v-for="activity in parts.app" :key="activity.id">
              <button type="button" :class="styles.activityActionRow" role="menuitem" @click="select(activity)"><span :class="styles.activityActionTitle">{{ activity.title }}</span></button>
            </li>
          </ul>
          <div v-if="parts.app.length && parts.actions.length" :class="styles.activitySectionDivider" role="separator" />
          <ul v-if="parts.actions.length" :class="styles.activityActionList" role="menu" aria-label="Actions">
            <li v-for="activity in parts.actions" :key="activity.id">
              <button type="button" :class="styles.activityActionRow" role="menuitem" @click="select(activity)"><span :class="styles.activityActionTitle">{{ activity.title }}</span></button>
            </li>
          </ul>
        </div>
        <div v-if="$slots.footer" :class="styles.section"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
