<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ButtonHTMLAttributes } from 'vue';
import type { ButtonRole, Size, Variant } from '@larose-ui/core';
import { createAsyncStateMachine } from '@larose-ui/core';
import type { ButtonShape } from '../../button/types';
import Button from '../Button/Button.vue';

const props = withDefaults(
  defineProps<{
    action: () => Promise<void>;
    variant?: Variant;
    size?: Size;
    buttonRole?: ButtonRole;
    shape?: ButtonShape;
    disabled?: boolean;
    loadingLabel?: string;
    fullWidth?: boolean;
    flexible?: boolean;
    iconOnly?: boolean;
    tooltip?: string;
    class?: string;
    style?: ButtonHTMLAttributes['style'];
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
);

const emit = defineEmits<{
  success: [];
  error: [error: unknown];
}>();

const machine = createAsyncStateMachine();
const version = ref(0);

const loading = computed(() => {
  version.value;
  return machine.state === 'submitting';
});

const errorMessage = computed(() => {
  version.value;
  const err = machine.error;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: string }).message);
  }
  return err ? String(err) : null;
});

async function handleClick() {
  machine.send({ type: 'SUBMIT' });
  version.value += 1;
  try {
    await props.action();
    machine.send({ type: 'SUCCESS' });
    emit('success');
  } catch (err) {
    machine.send({ type: 'ERROR', error: err });
    emit('error', err);
  } finally {
    version.value += 1;
  }
}
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :button-role="buttonRole"
    :shape="shape"
    :loading="loading"
    :error="loading ? null : errorMessage"
    :disabled="disabled"
    :loading-label="loadingLabel"
    :full-width="fullWidth"
    :flexible="flexible"
    :icon-only="iconOnly"
    :tooltip="tooltip"
    :class="$props.class"
    :style="style"
    :type="type"
    @click="handleClick"
  >
    <template v-if="$slots.leftIcon" #leftIcon>
      <slot name="leftIcon" />
    </template>
    <slot />
    <template v-if="$slots.rightIcon" #rightIcon>
      <slot name="rightIcon" />
    </template>
  </Button>
</template>
