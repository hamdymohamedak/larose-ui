<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useObservability } from './context';

const props = defineProps<{
  name: string;
  onAbandon?: () => void;
}>();

const { track, collector } = useObservability();
const opened = ref(false);
const completed = ref(false);

let unsubscribe: (() => void) | undefined;

onMounted(() => {
  unsubscribe = collector.subscribe((event) => {
    if (
      event.component === props.name &&
      (event.type === 'form.submitted' || event.type === 'form.success')
    ) {
      completed.value = true;
    }
  });

  if (!opened.value) {
    opened.value = true;
    track({ type: 'form.opened', component: props.name });
  }
});

onUnmounted(() => {
  unsubscribe?.();
  if (!completed.value) {
    track({ type: 'form.abandoned', component: props.name });
    props.onAbandon?.();
  }
});

function handleFocus(e: FocusEvent) {
  const target = e.target as HTMLElement | null;
  if (target?.matches?.('input, select, textarea')) {
    track({
      type: 'form.field_focused',
      component: props.name,
      metadata: { field: target.getAttribute('name') ?? undefined },
    });
  }
}
</script>

<template>
  <div :data-lr-observed-form="name" @focusin="handleFocus">
    <slot />
  </div>
</template>
