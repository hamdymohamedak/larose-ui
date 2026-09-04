<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { PickerOption } from '../../Picker/types';
import { PICKER_ROW_HEIGHT_PX } from '../../Picker/utils';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    id: string;
    label?: string;
    options: PickerOption[];
    modelValue?: string;
    value?: string;
    disabled?: boolean;
    columnFlex?: number;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{
  'update:modelValue': [string];
  change: [string];
}>();

const viewportRef = ref<HTMLElement | null>(null);
const syncing = ref(false);
const current = computed(
  () => props.modelValue ?? props.value ?? props.options[0]?.value ?? '',
);
const selectedIndex = computed(() =>
  Math.max(
    0,
    props.options.findIndex((option) => option.value === current.value),
  ),
);

const padding = `calc((var(--lr-picker-wheel-height) - ${PICKER_ROW_HEIGHT_PX}px) / 2)`;

function commit(index: number) {
  const option = props.options[Math.max(0, Math.min(props.options.length - 1, index))];
  if (!option || option.disabled) return;
  if (option.value === current.value) return;
  emit('update:modelValue', option.value);
  emit('change', option.value);
}

function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
  const el = viewportRef.value;
  if (!el) return;
  syncing.value = true;
  el.scrollTo({ top: index * PICKER_ROW_HEIGHT_PX, behavior });
  requestAnimationFrame(() => {
    syncing.value = false;
  });
}

function snapFromScroll() {
  const el = viewportRef.value;
  if (!el || props.disabled || syncing.value) return;
  const index = Math.round(el.scrollTop / PICKER_ROW_HEIGHT_PX);
  const clamped = Math.max(0, Math.min(props.options.length - 1, index));
  scrollToIndex(clamped, 'smooth');
  commit(clamped);
}

function onScroll() {
  if (syncing.value || props.disabled) return;
  const el = viewportRef.value;
  if (!el) return;
  const index = Math.round(el.scrollTop / PICKER_ROW_HEIGHT_PX);
  commit(index);
}

function onKeyDown(event: KeyboardEvent) {
  if (props.disabled) return;
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    const next = Math.max(0, selectedIndex.value - 1);
    scrollToIndex(next, 'smooth');
    commit(next);
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    const next = Math.min(props.options.length - 1, selectedIndex.value + 1);
    scrollToIndex(next, 'smooth');
    commit(next);
  }
}

onMounted(() => nextTick(() => scrollToIndex(selectedIndex.value)));
watch(selectedIndex, (index) => nextTick(() => scrollToIndex(index)));
</script>

<template>
  <div
    :class="cn(styles.wheelColumn, props.class)"
    role="group"
    :style="{
      ...(columnFlex !== undefined ? { flex: columnFlex } : {}),
      ...props.style,
    }"
  >
    <span v-if="label" :class="styles.wheelLabel">{{ label }}</span>
    <div
      ref="viewportRef"
      :class="styles.wheelViewport"
      :style="{
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
      }"
      @scroll="onScroll"
      @scrollend="snapFromScroll"
    >
      <div :class="styles.wheelFadeTop" aria-hidden="true" />
      <div :class="styles.wheelSelection" aria-hidden="true" />
      <div
        :id="id"
        :class="styles.wheelList"
        role="listbox"
        :aria-label="label"
        :aria-activedescendant="`${id}-option-${selectedIndex}`"
        :tabindex="disabled ? -1 : 0"
        @keydown="onKeyDown"
        :style="{ paddingTop: padding, paddingBottom: padding }"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          :id="`${id}-option-${index}`"
          data-wheel-item=""
          :class="styles.wheelItem"
          role="option"
          :aria-selected="option.value === current"
          :data-centered="option.value === current ? 'true' : undefined"
          :data-disabled="option.disabled ? 'true' : undefined"
          :style="{
            height: `${PICKER_ROW_HEIGHT_PX}px`,
            scrollSnapAlign: 'center',
          }"
          @click="
            () => {
              if (disabled || option.disabled) return;
              scrollToIndex(index, 'smooth');
              commit(index);
            }
          "
        >
          <span :class="styles.wheelItemLabel">{{ option.label }}</span>
        </div>
      </div>
      <div :class="styles.wheelFadeBottom" aria-hidden="true" />
    </div>
  </div>
</template>
