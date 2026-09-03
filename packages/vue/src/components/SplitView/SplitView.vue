<script setup lang="ts">
import { computed, provide, reactive, ref, watch } from 'vue';
import type { SplitCompactMode, SplitOrientation, SplitPaneConfig } from '../../SplitView/types';
import {
  defaultSizesFromPanes,
  redistributeHiddenPane,
  resizeAdjacentSizes,
} from '../../SplitView/utils';
import styles from '@larose-ui/styles/components/SplitView/SplitView.module.css';
import { cn } from '../../utils/cn';
import { splitViewKey } from '../../composables/useSplitView';

export interface RegisteredPane {
  id: string;
  label?: string;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  collapsible: boolean;
  defaultVisible: boolean;
  visible?: boolean;
  class?: string;
  ariaLabel?: string;
  slot?: unknown;
}

const props = withDefaults(
  defineProps<{
    orientation?: SplitOrientation;
    compactMode?: SplitCompactMode;
    storageKey?: string;
    class?: string;
    style?: Record<string, string | number>;
    'aria-label'?: string;
  }>(),
  {
    orientation: 'horizontal',
    compactMode: 'side-by-side',
    'aria-label': 'Split view',
  },
);

const emit = defineEmits<{ sizesChange: [sizes: number[]] }>();
const STORAGE_PREFIX = 'larose-split-view';
const containerRef = ref<HTMLElement | null>(null);
const panes = reactive<RegisteredPane[]>([]);
const sizes = ref<number[]>([]);
const visible = ref<boolean[]>([]);

function registerPane(pane: RegisteredPane) {
  const index = panes.findIndex((p) => p.id === pane.id);
  if (index >= 0) panes[index] = pane;
  else panes.push(pane);
}

function unregisterPane(id: string) {
  const index = panes.findIndex((p) => p.id === id);
  if (index >= 0) panes.splice(index, 1);
}

provide('larose-split-view-register', { registerPane, unregisterPane });

const paneConfigs = computed<SplitPaneConfig[]>(() =>
  panes.map((pane) => ({
    id: pane.id,
    label: pane.label,
    minSize: pane.minSize,
    maxSize: pane.maxSize,
    defaultSize: pane.defaultSize,
    collapsible: pane.collapsible,
    defaultVisible: pane.defaultVisible,
  })),
);

function loadState(paneCount: number, fallbackSizes: number[], fallbackVisible: boolean[]) {
  if (props.storageKey && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${props.storageKey}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { sizes?: number[]; visible?: boolean[] };
        if (parsed.sizes?.length === paneCount && parsed.visible?.length === paneCount) {
          return { sizes: parsed.sizes, visible: parsed.visible };
        }
      }
    } catch {
      /* ignore */
    }
  }
  return { sizes: fallbackSizes, visible: fallbackVisible };
}

watch(
  paneConfigs,
  (configs) => {
    if (!configs.length) return;
    const fallbackSizes = defaultSizesFromPanes(configs);
    const fallbackVisible = configs.map((p) => p.defaultVisible);
    const loaded = loadState(configs.length, fallbackSizes, fallbackVisible);
    sizes.value = loaded.sizes;
    visible.value = loaded.visible;
  },
  { deep: true },
);

watch([sizes, visible], () => {
  if (!props.storageKey || typeof window === 'undefined') return;
  window.localStorage.setItem(
    `${STORAGE_PREFIX}:${props.storageKey}`,
    JSON.stringify({ sizes: sizes.value, visible: visible.value }),
  );
  emit('sizesChange', sizes.value);
});

function showPane(id: string) {
  const index = panes.findIndex((p) => p.id === id);
  if (index < 0) return;
  const next = [...visible.value];
  next[index] = true;
  visible.value = next;
}

function hidePane(id: string) {
  const index = panes.findIndex((p) => p.id === id);
  if (index < 0 || !panes[index]?.collapsible) return;
  const nextVisible = [...visible.value];
  nextVisible[index] = false;
  visible.value = nextVisible;
  sizes.value = redistributeHiddenPane(sizes.value, index, nextVisible);
}

const hiddenPanes = computed(() =>
  panes
    .map((pane, index) => ({ id: pane.id, label: pane.label ?? pane.id, index }))
    .filter((pane) => !visible.value[pane.index] && panes[pane.index]?.collapsible)
    .map(({ id, label }) => ({ id, label })),
);

const splitCtx = reactive({
  showPane,
  hidePane,
  hiddenPanes: [] as Array<{ id: string; label: string }>,
});
watch(hiddenPanes, (v) => {
  splitCtx.hiddenPanes = v;
}, { immediate: true });
provide(splitViewKey, splitCtx);

function isVisible(index: number) {
  const pane = panes[index];
  if (pane?.visible !== undefined) return pane.visible;
  return visible.value[index] ?? true;
}

function paneStyle(index: number, shown: boolean) {
  const paneSize = shown ? `${sizes.value[index] ?? 0}%` : '0%';
  if (props.compactMode === 'stack') {
    return { flex: shown ? '1 1 auto' : '0 0 auto' };
  }
  return props.orientation === 'horizontal'
    ? { flex: `0 0 ${paneSize}`, width: paneSize }
    : { flex: `0 0 ${paneSize}`, height: paneSize };
}

function showDivider(index: number, shown: boolean) {
  if (props.compactMode === 'stack' || !shown || index >= panes.length - 1) return false;
  return panes.slice(index + 1).some((_, nextIndex) => isVisible(index + 1 + nextIndex));
}

function startResize(dividerIndex: number, startCoord: number, initialSizes: number[]) {
  const mins = panes.map((p) => p.minSize);
  const maxes = panes.map((p) => p.maxSize);
  const moveHandler = (event: MouseEvent) => {
    const host = containerRef.value;
    const total = host
      ? props.orientation === 'horizontal'
        ? host.getBoundingClientRect().width
        : host.getBoundingClientRect().height
      : 1;
    const deltaPx =
      props.orientation === 'horizontal' ? event.clientX - startCoord : event.clientY - startCoord;
    const deltaPercent = (deltaPx / Math.max(total, 1)) * 100;
    sizes.value = resizeAdjacentSizes(initialSizes, dividerIndex, deltaPercent, mins, maxes);
  };
  const onUp = () => {
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', onUp);
  };
  window.addEventListener('mousemove', moveHandler);
  window.addEventListener('mouseup', onUp);
}
</script>

<template>
  <div style="display: contents">
    <!-- panes register via slot -->
    <div style="display: none"><slot /></div>
    <slot name="toolbar" />
    <div
      ref="containerRef"
      :class="cn(styles.splitView, props.class)"
      :style="props.style"
      :data-orientation="orientation"
      :data-compact="compactMode === 'stack' ? 'stack' : undefined"
      role="group"
      :aria-label="props['aria-label']"
    >
      <template v-for="(pane, index) in panes" :key="pane.id">
        <section
          :class="cn(styles.pane, pane.class)"
          :style="paneStyle(index, isVisible(index))"
          :data-hidden="isVisible(index) ? undefined : 'true'"
          :aria-label="pane.ariaLabel ?? pane.label ?? pane.id"
          :hidden="!isVisible(index)"
        >
          <div :class="styles.paneBody">
            <slot :name="`pane-${pane.id}`" />
            <!-- fallback: content registered in pane slot via teleport-less render -->
            <component :is="pane.slot" v-if="pane.slot" />
          </div>
        </section>
        <div
          v-if="showDivider(index, isVisible(index))"
          :class="styles.divider"
          role="separator"
          :aria-orientation="orientation === 'horizontal' ? 'vertical' : 'horizontal'"
          tabindex="0"
          @mousedown.prevent="
            startResize(
              index,
              orientation === 'horizontal' ? ($event as MouseEvent).clientX : ($event as MouseEvent).clientY,
              [...sizes],
            )
          "
        />
      </template>
    </div>
  </div>
</template>
