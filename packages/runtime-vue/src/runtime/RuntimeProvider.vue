<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { LaRoseRuntimeContext, RuntimeEvent } from '@larose-ui/core';
import { createRuntimeContext, provideRuntime } from './context';

const props = defineProps<{
  initialContext?: Partial<LaRoseRuntimeContext>;
  onEvent?: (event: RuntimeEvent) => void;
}>();

const runtime = createRuntimeContext(props.initialContext, props.onEvent);
provideRuntime(runtime.value);

onMounted(() => runtime.mount());
onUnmounted(() => runtime.unmount());
</script>

<template>
  <slot />
</template>
