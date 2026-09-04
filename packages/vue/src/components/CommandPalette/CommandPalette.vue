<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/CommandPalette/CommandPalette.module.css';
import { cn } from '../../utils/cn';
import { useLaRosePortalTarget } from '../../composables/useLaRosePortalTarget';

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
const portalTarget = useLaRosePortalTarget();
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

const grouped = computed(() => {
  const groups: Array<{ group: string; items: Array<CommandPaletteItem & { flatIndex: number }> }> =
    [];
  let flatIndex = 0;
  const buckets = new Map<string, Array<CommandPaletteItem & { flatIndex: number }>>();

  for (const item of filtered.value) {
    const key = item.group ?? 'Commands';
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
      groups.push({ group: key, items: bucket });
    }
    bucket.push({ ...item, flatIndex });
    flatIndex += 1;
  }

  return groups;
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
  <Teleport v-if="open" :to="portalTarget">
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
          type="search"
          :class="styles.search"
          :placeholder="placeholder"
          :value="query"
          role="combobox"
          aria-controls="larose-command-list"
          :aria-expanded="filtered.length > 0"
          :aria-activedescendant="
            filtered[activeIndex] ? `larose-command-${filtered[activeIndex]!.id}` : undefined
          "
          aria-autocomplete="list"
          @input="
            query = ($event.target as HTMLInputElement).value;
            activeIndex = 0;
          "
          @keydown="onKeyDown"
        />
        <ul
          id="larose-command-list"
          :class="styles.list"
          role="listbox"
          :aria-label="ariaLabel"
        >
          <li v-if="!filtered.length" :class="styles.empty" role="presentation">
            {{ emptyMessage }}
          </li>
          <template v-else>
            <li
              v-for="section in grouped"
              :key="section.group"
              :class="styles.group"
              role="presentation"
            >
              <div :class="styles.groupLabel">{{ section.group }}</div>
              <ul role="group" :aria-label="section.group">
                <li v-for="item in section.items" :key="item.id" role="presentation">
                  <button
                    :id="`larose-command-${item.id}`"
                    type="button"
                    role="option"
                    :aria-selected="item.flatIndex === activeIndex"
                    :class="styles.item"
                    :data-state="item.flatIndex === activeIndex ? 'active' : 'inactive'"
                    @click="select(item)"
                    @mouseenter="activeIndex = item.flatIndex"
                  >
                    {{ item.label }}
                  </button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
