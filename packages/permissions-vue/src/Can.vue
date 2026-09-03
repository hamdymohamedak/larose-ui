<script setup lang="ts">
import type { PermissionFallback } from '@larose-ui/core';
import { resolvePermissionFallback } from '@larose-ui/permissions-core';
import { computed } from 'vue';
import { usePermission } from './context';

const props = withDefaults(
  defineProps<{
    permission: string;
    resource?: string;
    fallback?: PermissionFallback;
    reason?: string;
  }>(),
  {
    fallback: 'hidden',
  },
);

const result = usePermission(
  computed(() => props.permission),
  computed(() => props.resource),
);
const mode = computed(() =>
  resolvePermissionFallback(result.value.allowed, false, props.fallback),
);
const explainReason = computed(() => props.reason ?? result.value.reason);
</script>

<template>
  <span v-if="mode === 'loading'" aria-busy="true">
    <slot />
  </span>
  <span
    v-else-if="mode === 'forbidden' || mode === 'disabled' || mode === 'readonly'"
    class="lr-explainable"
    :data-variant="mode === 'forbidden' ? 'forbidden' : mode === 'readonly' ? 'readonly' : 'disabled'"
    :title="explainReason ?? 'Not allowed'"
    style="display: inline-flex; flex-direction: column; gap: 0.25rem"
  >
    <span aria-disabled="true" :data-permission-fallback="mode">
      <slot />
    </span>
    <span
      role="note"
      style="font-size: var(--lr-font-size-xs, 0.75rem); color: var(--lr-color-text-muted, #64748b); max-width: 16rem"
    >
      {{ explainReason ?? 'Access denied' }}
    </span>
  </span>
  <slot v-else-if="mode !== 'hidden'" />
</template>
