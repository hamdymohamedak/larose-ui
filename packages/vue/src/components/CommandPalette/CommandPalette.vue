<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/CommandPalette/CommandPalette.module.css';
import { cn } from '../../utils/cn';

export interface CommandPaletteItem {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
  onSelect: () => void;
}

const props = withDefaults(
  defineProps<{
    open: boolean;
    items: CommandPaletteItem[];
    placeholder?: string;
    emptyMessage?: string;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  {
    placeholder: 'Search commands…',
    emptyMessage: 'No commands found',
    ariaLabel: 'Command palette',
  },
);

const emit = defineEmits<{ openChange: [open: boolean] }>();
const query = ref('');
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.items;
  return props.items.filter((item) =>
    [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase().includes(q),
  );
});

function close() {
  emit('openChange', false);
  query.value = '';
  activeIndex.value = 0;
}

function select(item: CommandPaletteItem) {
  item.onSelect();
  close();
}

watch(
  () => props.open,
  async (open, _prev, onCleanup) => {
    if (!open) return;
    query.value = '';
    activeIndex.value = 0;
    await nextTick();
    inputRef.value?.focus();
    const deactivate = activateOverlayFocus({
      container: dialogRef.value,
      onEscape: close,
      autoFocus: false,
    });
    onCleanup(() => deactivate());
  },
);

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, Math.max(filtered.value.length - 1, 0));
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const item = filtered.value[activeIndex.value];
    if (item) select(item);
  }
}
</script>

<template>
  <Teleport v-if="open" to="[data-lr-portal-root], [data-lr-provider], body">
    <div :class="styles.overlay" role="presentation" @click.self="close" @keydown="onKeyDown">
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        :class="cn(styles.dialog, props.class)"
        :style="props.style"
      >
        <input
          ref="inputRef"
          :class="styles.search"
          :placeholder="placeholder"
          :value="query"
          @input="query = ($event.target as HTMLInputElement).value"
        />
        <div :class="styles.list" role="listbox">
          <p v-if="!filtered.length" :class="styles.empty">{{ emptyMessage }}</p>
          <button
            v-for="(item, index) in filtered"
            :key="item.id"
            type="button"
            role="option"
            :aria-selected="index === activeIndex"
            :class="styles.item"
            :data-active="index === activeIndex ? 'true' : undefined"
            @click="select(item)"
            @mouseenter="activeIndex = index"
          >
            <span v-if="item.group" :class="styles.groupLabel">{{ item.group }}</span>
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
