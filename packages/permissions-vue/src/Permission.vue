<script setup lang="ts">
import type { PermissionFallback } from '@larose-ui/core';
import { resolvePermissionFallback } from '@larose-ui/permissions-core';
import { computed } from 'vue';
import { usePermission, usePermissions } from './context';

const props = withDefaults(
  defineProps<{
    action: string;
    resource?: string;
    fallback?: PermissionFallback;
    reason?: string;
  }>(),
  {
    fallback: 'disabled',
  },
);

const perms = usePermissions();
const result = usePermission(
  computed(() => props.action),
  computed(() => props.resource),
);
const mode = computed(() =>
  resolvePermissionFallback(result.value.allowed, perms.loading, props.fallback),
);
const explainReason = computed(
  () => props.reason ?? result.value.reason ?? `Missing permission: ${props.action}`,
);
</script>

<template>
  <div v-if="mode === 'loading'" data-permission-state="loading" aria-busy="true">
    <slot />
  </div>
  <span
    v-else-if="!result.allowed && mode !== 'hidden'"
    class="lr-explainable"
    :data-variant="mode === 'forbidden' ? 'forbidden' : 'disabled'"
    :title="explainReason"
    style="display: inline-flex; flex-direction: column; gap: 0.25rem"
  >
    <div :data-permission-state="mode" aria-disabled="true">
      <slot />
    </div>
    <span
      role="note"
      style="font-size: var(--lr-font-size-xs, 0.75rem); color: var(--lr-color-text-muted, #64748b); max-width: 16rem"
    >
      {{ explainReason }}
    </span>
  </span>
  <slot v-else-if="result.allowed" />
</template>
