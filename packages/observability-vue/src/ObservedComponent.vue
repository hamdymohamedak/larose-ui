<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useObservability } from './context';

const props = defineProps<{
  name: string;
  metadata?: Record<string, unknown>;
}>();

const { track } = useObservability();
const start = performance.now();
const warned = ref(false);

onMounted(() => {
  const renderTimeMs = performance.now() - start;
  const threshold =
    renderTimeMs >= 50 ? 'critical' : renderTimeMs >= 16 ? 'slow' : 'ok';

  track({
    type: 'performance',
    component: props.name,
    metadata: { renderTimeMs, threshold, ...props.metadata },
  });

  if (threshold !== 'ok' && !warned.value) {
    warned.value = true;
    console.warn(
      `[laRose] Slow component: ${props.name} rendered in ${renderTimeMs.toFixed(1)}ms (${threshold})`,
    );
  }
});
</script>

<template>
  <div :data-lr-observed="name">
    <slot />
  </div>
</template>
