<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { ButtonHTMLAttributes } from 'vue';
import type { ButtonRole, Size, UIState, Variant } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Button/Button.module.css';
import { useComponentDefaults } from '../../composables/useComponentDefaults';
import { cn } from '../../utils/cn';
import { hasDefaultSlotText } from '../../utils/slots';
import type { ButtonShape } from '../../button/types';
import { resolveButtonShape } from '../../button/utils';
import Spinner from '../Spinner/Spinner.vue';

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    buttonRole?: ButtonRole;
    shape?: ButtonShape;
    state?: UIState;
    loading?: boolean;
    loadingLabel?: string;
    error?: string | null;
    disabled?: boolean;
    opensAnotherView?: boolean;
    flexible?: boolean;
    iconOnly?: boolean;
    fullWidth?: boolean;
    tooltip?: string;
    class?: string;
    style?: ButtonHTMLAttributes['style'];
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    buttonRole: 'normal',
    loading: false,
    error: null,
    disabled: false,
    opensAnotherView: false,
    flexible: false,
    iconOnly: false,
    fullWidth: false,
    type: 'button',
  },
);

const merged = useComponentDefaults('Button', props);
const slots = useSlots();

const uiState = computed(() =>
  resolveUIState({
    state: merged.state,
    loading: merged.loading,
    error: merged.error,
    disabled: merged.disabled,
  }),
);

const isDisabled = computed(
  () =>
    merged.disabled ||
    uiState.value === 'loading' ||
    uiState.value === 'disabled',
);

const isLoading = computed(() => uiState.value === 'loading');
const hasText = computed(() => hasDefaultSlotText(slots));
const hasIcon = computed(() => Boolean(slots.leftIcon || slots.rightIcon));

const resolvedShape = computed(() =>
  resolveButtonShape({
    shape: merged.shape,
    iconOnly: merged.iconOnly,
    hasText: hasText.value && !isLoading.value,
    hasIcon: hasIcon.value,
  }),
);

const resolvedVariant = computed(() =>
  merged.buttonRole === 'primary' && merged.variant !== 'destructive'
    ? 'primary'
    : merged.variant,
);
</script>

<template>
  <button
    :type="merged.type"
    :class="cn(styles.button, merged.class)"
    :style="merged.style"
    :data-variant="resolvedVariant"
    :data-size="merged.size"
    :data-shape="resolvedShape"
    :data-role="merged.buttonRole !== 'normal' ? merged.buttonRole : undefined"
    :data-state="uiState"
    :data-flexible="merged.flexible ? 'true' : undefined"
    :data-full-width="merged.fullWidth ? 'true' : undefined"
    :disabled="isDisabled"
    :aria-busy="isLoading"
    :aria-disabled="isDisabled"
    :title="merged.tooltip && !isDisabled ? merged.tooltip : undefined"
  >
    <span v-if="isLoading" :class="styles.spinner" aria-hidden="true">
      <Spinner size="sm" />
    </span>
    <span v-if="!isLoading && $slots.leftIcon" :class="styles.icon">
      <slot name="leftIcon" />
    </span>
    <span v-if="hasText || isLoading" :class="styles.content">
      <slot v-if="!isLoading || !merged.loadingLabel" />
      <template v-else>{{ merged.loadingLabel }}</template>
    </span>
    <span v-if="!isLoading && $slots.rightIcon" :class="styles.icon">
      <slot name="rightIcon" />
    </span>
    <span v-if="uiState === 'error' && merged.error" :class="styles.errorMessage" role="alert">
      {{ merged.error }}
    </span>
  </button>
</template>
