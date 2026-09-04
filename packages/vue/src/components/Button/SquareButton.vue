<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import styles from '@larose-ui/styles/components/Button/Button.module.css';
import { cn } from '../../utils/cn';
import Tooltip from '../Tooltip/Tooltip.vue';

withDefaults(
  defineProps<{
    tooltip?: string;
    pressed?: boolean;
    class?: string;
    style?: ButtonHTMLAttributes['style'];
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    pressed: false,
  },
);
</script>

<template>
  <Tooltip v-if="tooltip" :content="tooltip">
    <button
      type="button"
      :class="cn(styles.squareButton, $props.class)"
      :style="style"
      :data-pressed="pressed ? 'true' : undefined"
      :aria-label="ariaLabel"
      :aria-pressed="pressed ? 'true' : undefined"
      :disabled="disabled"
    >
      <span :class="styles.squareButtonIcon">
        <slot />
      </span>
    </button>
  </Tooltip>
  <button
    v-else
    type="button"
    :class="cn(styles.squareButton, $props.class)"
    :style="style"
    :data-pressed="pressed ? 'true' : undefined"
    :aria-label="ariaLabel"
    :aria-pressed="pressed ? 'true' : undefined"
    :disabled="disabled"
  >
    <span :class="styles.squareButtonIcon">
      <slot />
    </span>
  </button>
</template>
