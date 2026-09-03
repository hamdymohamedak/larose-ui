<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import type { ButtonRole, Size, Variant } from '@larose-ui/core';
import type { ButtonShape } from '../../button/types';
import Button from '../Button/Button.vue';

withDefaults(
  defineProps<{
    complete: boolean;
    variant?: Variant;
    size?: Size;
    buttonRole?: ButtonRole;
    shape?: ButtonShape;
    disabled?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    fullWidth?: boolean;
    class?: string;
    style?: ButtonHTMLAttributes['style'];
  }>(),
  {
    disabled: false,
    loading: false,
  },
);
</script>

<template>
  <Button
    type="submit"
    :variant="variant"
    :size="size"
    :button-role="buttonRole"
    :shape="shape"
    :disabled="disabled || !complete"
    :loading="loading"
    :loading-label="loadingLabel"
    :full-width="fullWidth"
    :class="$props.class"
    :style="style"
  >
    <slot>Continue</slot>
  </Button>
</template>
