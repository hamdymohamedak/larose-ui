<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { TypographyRole } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/TextView/TextView.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    editable?: boolean;
    selectable?: boolean;
    maxHeight?: string;
    typographyRole?: TypographyRole;
    modelValue?: string;
    class?: string;
    style?: CSSProperties;
    disabled?: boolean;
  }>(),
  { editable: false, selectable: true, typographyRole: 'body' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div
    :class="cn(styles.view, props.class)"
    :style="{ maxHeight, ...((props.style as object) ?? {}) }"
    :data-lr-type="typographyRole"
    :data-selectable="selectable ? 'true' : undefined"
  >
    <textarea
      v-if="editable"
      :class="styles.editable"
      :value="modelValue"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div v-else :class="cn(styles.display, maxHeight ? styles.scrollable : undefined)">
      <slot>{{ modelValue }}</slot>
    </div>
  </div>
</template>
