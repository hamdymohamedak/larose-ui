<script setup lang="ts">
import { watch } from 'vue';
import type {
  EventCollector,
  ObservabilityAdapter,
  ObservabilityConfig,
} from '@larose-ui/observability-core';
import {
  createObservabilityValue,
  provideObservability,
  syncObservabilityScope,
} from './context';

const props = defineProps<{
  adapter?: ObservabilityAdapter;
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  debug?: boolean;
  collector?: EventCollector;
}>();

const value = createObservabilityValue({
  adapter: props.adapter,
  tenantId: props.tenantId,
  userId: props.userId,
  sessionId: props.sessionId,
  debug: props.debug,
  collector: props.collector,
} satisfies ObservabilityConfig & { collector?: EventCollector });

provideObservability(value);

const scopeRef = {
  current: `${props.tenantId ?? ''}:${props.userId ?? ''}:${props.sessionId ?? ''}`,
};

watch(
  () =>
    [props.adapter, props.tenantId, props.userId, props.sessionId] as const,
  () => {
    syncObservabilityScope(
      value,
      {
        adapter: props.adapter,
        tenantId: props.tenantId,
        userId: props.userId,
        sessionId: props.sessionId,
      },
      scopeRef,
    );
  },
);
</script>

<template>
  <slot />
</template>
