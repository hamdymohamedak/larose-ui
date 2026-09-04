<script setup lang="ts">
import { computed } from 'vue';
import { parseMnemonicLabel, resolveMnemonicKey } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Menu/Menu.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label: string;
    mnemonic?: string;
    showAccessKey?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  { showAccessKey: false },
);

const parts = computed(() => {
  const parsed = parseMnemonicLabel(props.label);
  const accessKey = resolveMnemonicKey(props.label, props.mnemonic) ?? parsed.mnemonicKey;
  const display = parsed.displayLabel;
  if (!props.showAccessKey || !accessKey) {
    return { before: display, char: '', after: '' };
  }
  const index = display.toLowerCase().indexOf(accessKey.toLowerCase());
  if (index === -1) return { before: display, char: '', after: '' };
  return {
    before: display.slice(0, index),
    char: display.charAt(index),
    after: display.slice(index + 1),
  };
});
</script>

<template>
  <span :class="cn(props.class)" :style="props.style">
    {{ parts.before }}<span v-if="parts.char" :class="styles.mnemonicChar">{{ parts.char }}</span>{{ parts.after }}
  </span>
</template>
