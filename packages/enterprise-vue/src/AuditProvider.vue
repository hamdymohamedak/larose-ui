<script setup lang="ts">
import { watch } from 'vue';
import { createAuditContext, provideAudit } from './context';

const props = withDefaults(defineProps<{ actor?: string }>(), { actor: 'system' });
const store = createAuditContext(props.actor);
provideAudit(store);
watch(
  () => props.actor,
  (actor) => store.setActor(actor ?? 'system'),
);
</script>

<template>
  <slot />
</template>
