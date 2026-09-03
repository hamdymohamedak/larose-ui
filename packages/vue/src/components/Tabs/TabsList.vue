<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { handleTabListKeyDown } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
import { cn } from '../../utils/cn';
import { useTabsContext } from './context';

const props = withDefaults(
  defineProps<{ class?: string; style?: CSSProperties; ariaLabel?: string }>(),
  { ariaLabel: 'Tabs' },
);

const ctx = useTabsContext('TabsList');

function onKeyDown(event: KeyboardEvent) {
  handleTabListKeyDown(event, event.currentTarget as HTMLElement, {
    activeValue: ctx.value.value,
    onValueChange: ctx.onValueChange,
  });
}
</script>

<template>
  <div
    :class="cn(styles.list, props.class)"
    :style="props.style"
    role="tablist"
    :aria-label="props.ariaLabel"
    @keydown="onKeyDown"
  >
    <slot />
  </div>
</template>
