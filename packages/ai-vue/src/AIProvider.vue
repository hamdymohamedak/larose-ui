<script setup lang="ts">
import {
  createAIRuntime,
  createMockAdapter,
  type AIAdapter,
  type AIAuditEvent,
} from '@larose-ui/ai-core';
import { usePermissions } from '@larose-ui/permissions-vue';
import { provideAI } from './context';

const props = defineProps<{
  adapter?: AIAdapter;
  onAudit?: (event: AIAuditEvent) => void;
}>();

const { permissions } = usePermissions();

const runtime = createAIRuntime({
  adapter: props.adapter ?? createMockAdapter(),
  grantedPermissions: () => permissions,
  onAudit: props.onAudit,
});

provideAI(runtime);
</script>

<template>
  <slot />
</template>
