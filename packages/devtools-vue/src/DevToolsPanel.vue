<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { getComponentPerformance } from '@larose-ui/devtools-core';
import { useOptionalRuntime, useBreakpoint, useEnvironment, useI18n } from '@larose-ui/runtime-vue';
import { usePermissions } from '@larose-ui/permissions-vue';
import { useOptionalObservability } from '@larose-ui/observability-vue';

const props = withDefaults(defineProps<{ defaultOpen?: boolean }>(), { defaultOpen: false });

type Tab = 'context' | 'inspector';

const open = ref(props.defaultOpen);
const tab = ref<Tab>('context');
const inspectMode = ref(false);
const selected = ref<{ name: string; el: Element } | null>(null);
const hovered = ref<Element | null>(null);

const runtime = useOptionalRuntime();
const environment = useEnvironment();
const { breakpoint, width } = useBreakpoint();
const { locale, dir } = useI18n();
const { permissions } = usePermissions();
const observability = useOptionalObservability();

const performanceSummary = computed(() => {
  if (!selected.value || !observability) return null;
  const events = observability.collector.getEvents({ component: selected.value.name });
  return getComponentPerformance(events);
});

function pickTarget(el: Element | null) {
  if (!el) return null;
  const node = el.closest('[data-lr-component]') ?? el.closest('[data-lr-audited-field]');
  return node;
}

function onMove(e: MouseEvent) {
  if (!inspectMode.value) return;
  hovered.value = pickTarget(e.target as Element);
}

function onClick(e: MouseEvent) {
  if (!inspectMode.value) return;
  e.preventDefault();
  e.stopPropagation();
  const node = pickTarget(e.target as Element);
  if (node) {
    selected.value = {
      name: node.getAttribute('data-lr-component') ?? node.getAttribute('data-lr-audited-field') ?? 'unknown',
      el: node,
    };
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, true);
  window.addEventListener('click', onClick, true);
});
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove, true);
  window.removeEventListener('click', onClick, true);
});

const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
</script>

<template>
  <template v-if="!isProd">
    <button
      type="button"
      aria-label="Toggle laRose DevTools"
      style="position: fixed; bottom: 12px; right: 12px; z-index: 99999; border-radius: 999px; padding: 8px 12px; background: #111; color: #fff; border: none; cursor: pointer"
      @click="open = !open"
    >
      laRose
    </button>
    <aside
      v-if="open"
      data-lr-devtools
      style="position: fixed; bottom: 56px; right: 12px; width: 320px; max-height: 70vh; overflow: auto; z-index: 99999; background: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 12px; font-size: 12px"
    >
      <div style="display: flex; gap: 4px; margin-bottom: 8px">
        <button type="button" @click="tab = 'context'; inspectMode = false">Context</button>
        <button type="button" @click="tab = 'inspector'; inspectMode = true">Inspector</button>
      </div>
      <div v-if="tab === 'context'">
        <p>env: {{ environment }}</p>
        <p>locale: {{ locale }} ({{ dir }})</p>
        <p>breakpoint: {{ breakpoint }} @ {{ width }}px</p>
        <p>permissions: {{ permissions.join(', ') || '(none)' }}</p>
        <p>runtime: {{ runtime ? 'connected' : 'none' }}</p>
      </div>
      <div v-else>
        <p>{{ inspectMode ? 'Click a data-lr-* node' : 'Enable inspector' }}</p>
        <p v-if="selected">Selected: {{ selected.name }}</p>
        <pre v-if="performanceSummary">{{ JSON.stringify(performanceSummary, null, 2) }}</pre>
      </div>
    </aside>
  </template>
</template>
