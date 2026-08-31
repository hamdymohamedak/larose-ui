<script setup lang="ts">
import styles from '@larose-ui/styles/components/Alert/Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

withDefaults(
  defineProps<{
    variant?: AlertVariant;
    title?: string;
    onDismiss?: () => void;
  }>(),
  {
    variant: 'info',
  },
);
</script>

<template>
  <div :class="styles.alert" :data-variant="variant" role="alert">
    <div :class="styles.content">
      <strong v-if="title" :class="styles.title">{{ title }}</strong>
      <div :class="styles.message">
        <slot />
      </div>
    </div>
    <button
      v-if="onDismiss"
      type="button"
      :class="styles.dismiss"
      aria-label="Dismiss alert"
      @click="onDismiss"
    >
      ×
    </button>
  </div>
</template>
