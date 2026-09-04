<script setup lang="ts">
import styles from '@larose-ui/styles/components/SplitView/SplitView.module.css';
import { cn } from '../../utils/cn';
import { useSplitView } from '../../composables/useSplitView';

defineProps<{
  class?: string;
  style?: Record<string, string | number>;
}>();

const { hiddenPanes, showPane } = useSplitView();
</script>

<template>
  <div
    v-if="$slots.actions || hiddenPanes.length > 0"
    :class="cn(styles.toolbar, $props.class)"
    :style="$props.style"
    role="toolbar"
    aria-label="Split view toolbar"
  >
    <slot name="actions" />
    <button
      v-for="pane in hiddenPanes"
      :key="pane.id"
      type="button"
      :class="styles.toolbarButton"
      @click="showPane(pane.id)"
    >
      Show {{ pane.label }}
    </button>
  </div>
</template>
