<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
import { cn } from '../../utils/cn';
import type { LockupAxis } from '../../Lockup/types';

const props = withDefaults(
  defineProps<{
    axis?: LockupAxis;
    focused?: boolean;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  { axis: 'horizontal', focused: false },
);

const emit = defineEmits<{ focus: []; blur: []; click: [] }>();
</script>

<template>
  <button
    type="button"
    :class="cn(styles.lockup, props.class)"
    :style="props.style"
    :data-axis="axis"
    :data-focused="focused ? 'true' : undefined"
    :aria-label="ariaLabel"
    @focus="emit('focus')"
    @blur="emit('blur')"
    @click="emit('click')"
  >
    <div v-if="$slots.header" :class="styles.header"><slot name="header" /></div>
    <div :class="styles.content"><slot /></div>
    <div v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></div>
  </button>
</template>
