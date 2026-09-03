<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import styles from '@larose-ui/styles/components/Button/Button.module.css';
import { cn } from '../../utils/cn';
import Tooltip from '../Tooltip/Tooltip.vue';

withDefaults(
  defineProps<{
    helpTopic?: string;
    class?: string;
    style?: ButtonHTMLAttributes['style'];
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Help',
  },
);
</script>

<template>
  <Tooltip v-if="helpTopic" :content="helpTopic">
    <button
      type="button"
      :class="cn(styles.helpButton, $props.class)"
      :style="style"
      :aria-label="ariaLabel"
      :disabled="disabled"
    >
      ?
    </button>
  </Tooltip>
  <button
    v-else
    type="button"
    :class="cn(styles.helpButton, $props.class)"
    :style="style"
    :aria-label="ariaLabel"
    :disabled="disabled"
  >
    ?
  </button>
</template>
