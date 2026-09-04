<script setup lang="ts">
import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';
import type { SearchToken } from '../../SearchField/types';

defineProps<{ token: SearchToken }>();
const emit = defineEmits<{ remove: []; select: [] }>();
</script>

<template>
  <button type="button" :class="styles.token" @click="emit('select')">
    <span>{{ token.label }}</span>
    <span
      :class="styles.tokenRemove"
      aria-hidden="true"
      @click.stop="emit('remove')"
    >×</span>
  </button>
</template>
