<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { UIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/EmptyState/EmptyState.module.css';
import { cn } from '../../utils/cn';
import Button from '../Button/Button.vue';

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    actionLabel?: string;
    state?: UIState;
    class?: string;
    style?: CSSProperties;
  }>(),
  {
    state: 'empty',
  },
);

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <div
    :class="cn(styles.empty, $props.class)"
    :style="style"
    :data-state="state"
    role="status"
  >
    <div v-if="$slots.icon" :class="styles.icon">
      <slot name="icon" />
    </div>
    <h3 :class="styles.title">{{ title }}</h3>
    <p v-if="description" :class="styles.description">{{ description }}</p>
    <div v-if="actionLabel" :class="styles.action">
      <Button variant="primary" @click="emit('action')">
        {{ actionLabel }}
      </Button>
    </div>
  </div>
</template>
