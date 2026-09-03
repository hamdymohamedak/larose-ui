<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import { useObservability } from './context';

const props = defineProps<{
  name: string;
  fallback?: string;
}>();

const { track } = useObservability();
const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  const caught = err instanceof Error ? err : new Error(String(err));
  error.value = caught;
  track({
    type: 'error',
    component: props.name,
    metadata: {
      message: caught.message,
      stack: caught.stack,
    },
  });
  return false;
});
</script>

<template>
  <div v-if="error" role="alert" :data-lr-error-boundary="name">
    <slot v-if="$slots.fallback" name="fallback" :error="error" />
    <template v-else>
      {{ fallback ?? `Something went wrong in ${name}.` }}
    </template>
  </div>
  <slot v-else />
</template>
