<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { LONG_PRESS_MS } from '../../ContextMenu/utils';
import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
import { defaultDestructiveConfirmation, warnIfTooFewPullDownItems } from '../../PullDownButton/utils';
import styles from '@larose-ui/styles/components/PullDownButton/PullDownButton.module.css';
import { cn } from '../../utils/cn';
import Menu from '../Menu/Menu.vue';
import Dialog from '../Dialog/Dialog.vue';

export type PullDownButtonVariant = 'default' | 'more';

const props = withDefaults(defineProps<{
  label?: string; entries: MenuEntry[]; variant?: PullDownButtonVariant; menuTitle?: string;
  disabled?: boolean; longPress?: boolean; class?: string; style?: Record<string, string | number>;
  destructiveConfirmation?: { title?: string; description?: string; confirmLabel?: string; cancelLabel?: string };
}>(), { variant: 'default', disabled: false, longPress: false });

const emit = defineEmits<{ action: [MenuItemConfig] }>();
const open = ref(false);
const pending = ref<MenuItemConfig | null>(null);
const longPressTimer = ref<number | null>(null);
const prepared = computed(() => props.entries.map((e) => (e.type === 'separator' || e.type === 'submenu' ? e : { ...e, selected: undefined })));
watchEffect(() => warnIfTooFewPullDownItems(prepared.value));
const triggerLabel = computed(() => (props.variant === 'more' ? props.label ?? 'More' : props.label ?? 'Menu'));
const destructiveCopy = computed(() => pending.value ? { ...defaultDestructiveConfirmation(pending.value.label), ...props.destructiveConfirmation, confirmLabel: props.destructiveConfirmation?.confirmLabel ?? pending.value.label } : null);

function handleSelect(entry: MenuItemConfig) {
  if (entry.destructive) { pending.value = entry; open.value = false; return false; }
  entry.onSelect?.();
  emit('action', entry);
  return true;
}
function clear() { if (longPressTimer.value !== null) { window.clearTimeout(longPressTimer.value); longPressTimer.value = null; } }
function onPointerDown(e: PointerEvent) {
  if (!props.longPress || e.pointerType === 'mouse') return;
  clear();
  longPressTimer.value = window.setTimeout(() => {
    open.value = true;
  }, LONG_PRESS_MS);
}
</script>

<template>
  <Menu :entries="prepared" :title="menuTitle" :open="open" @open-change="open = $event" @entry-select="handleSelect">
    <button
      type="button"
      :class="cn(styles.trigger, variant === 'more' ? styles.moreTrigger : undefined, props.class)"
      :style="props.style"
      :disabled="disabled"
      :aria-label="variant === 'more' ? triggerLabel : undefined"
      @pointerdown="onPointerDown"
      @pointerup="clear" @pointercancel="clear" @pointerleave="clear"
    >
      <template v-if="variant === 'more'">
        <svg :class="styles.moreIcon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.75" /><circle cx="12" cy="12" r="1.75" /><circle cx="19" cy="12" r="1.75" /></svg>
      </template>
      <template v-else>
        <slot name="icon" />
        <span :class="styles.label">{{ triggerLabel }}</span>
        <svg :class="styles.chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
      </template>
    </button>
  </Menu>
  <Dialog
    v-if="destructiveCopy"
    :open="Boolean(pending)"
    :title="destructiveCopy.title!"
    :description="destructiveCopy.description"
    :confirm-label="destructiveCopy.confirmLabel"
    :cancel-label="destructiveConfirmation?.cancelLabel ?? 'Cancel'"
    variant="destructive"
    @close="pending = null"
    @confirm="pending?.onSelect?.(); if (pending) emit('action', pending); pending = null; open = false"
  />
</template>
