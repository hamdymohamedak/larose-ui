<script setup lang="ts">
import { watch } from 'vue';
import type { AbacContext } from '@larose-ui/permissions-core';
import {
  createPermissionStore,
  providePermissions,
  syncPermissionStore,
} from './context';

const props = withDefaults(
  defineProps<{
    permissions?: string[];
    loading?: boolean;
    context?: AbacContext;
  }>(),
  {
    permissions: () => [],
    loading: false,
    context: () => ({}),
  },
);

const store = createPermissionStore({
  permissions: props.permissions,
  loading: props.loading,
  context: props.context,
});
providePermissions(store);

watch(
  () => [props.permissions, props.loading, props.context] as const,
  () => {
    syncPermissionStore(store, {
      permissions: props.permissions,
      loading: props.loading,
      context: props.context,
    });
  },
  { deep: true },
);
</script>

<template>
  <slot />
</template>
