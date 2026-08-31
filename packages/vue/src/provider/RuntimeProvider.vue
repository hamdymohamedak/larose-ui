<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, shallowRef } from 'vue';
import { createRuntimeStore, type RuntimeStore } from '@larose-ui/runtime-core';
import type { LaRoseRuntimeContext, RuntimeEvent, SessionState } from '@larose-ui/core';
import { runtimeContextKey, type RuntimeContextValue } from '../runtime/types';

export interface RuntimeProviderProps {
  initialContext?: Partial<LaRoseRuntimeContext>;
  onEvent?: (event: RuntimeEvent) => void;
}

const props = defineProps<RuntimeProviderProps>();

const store = shallowRef<RuntimeStore>(createRuntimeStore({ initialContext: props.initialContext }));
const context = ref(store.value.getContext());

let unsubscribeStore: (() => void) | undefined;
let unsubscribeEvents: (() => void) | undefined;
let unbindA11y: (() => void) | undefined;

function setContext(patch: Partial<LaRoseRuntimeContext>) {
  store.value.setContext(patch);
}

function setSession(session: SessionState) {
  store.value.setSession(session);
}

provide<RuntimeContextValue>(runtimeContextKey, {
  get context() {
    return context.value;
  },
  store: store.value,
  setContext,
  setSession,
});

onMounted(() => {
  unsubscribeStore = store.value.subscribe(() => {
    context.value = store.value.getContext();
  });
  unbindA11y = store.value.bindA11yPreferences();
  if (props.onEvent) {
    unsubscribeEvents = store.value.eventBus.subscribe(props.onEvent);
  }
});

onUnmounted(() => {
  unsubscribeStore?.();
  unsubscribeEvents?.();
  unbindA11y?.();
});
</script>

<template>
  <slot />
</template>
