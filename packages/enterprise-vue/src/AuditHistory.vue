<script setup lang="ts">
import { computed } from 'vue';
import { useAudit } from './context';
import styles from './AuditHistory.module.css';

const props = defineProps<{
  field: string;
  resourceId?: string;
}>();

const emit = defineEmits<{ close: [] }>();
const { getHistory } = useAudit();
const history = computed(() => getHistory(props.field, props.resourceId));
</script>

<template>
  <aside :class="styles.panel" :aria-label="`Audit history for ${field}`">
    <header :class="styles.header">
      <strong>{{ field }} history</strong>
      <button type="button" aria-label="Close history" @click="emit('close')">×</button>
    </header>
    <p v-if="history.length === 0" :class="styles.empty">No changes recorded.</p>
    <ul v-else :class="styles.list">
      <li v-for="entry in history" :key="entry.id">
        <div :class="styles.change">
          {{ entry.before || '(empty)' }} → {{ entry.after || '(empty)' }}
        </div>
        <div :class="styles.meta">
          Changed by {{ entry.actor }} · {{ new Date(entry.timestamp).toLocaleString() }}
        </div>
      </li>
    </ul>
  </aside>
</template>
