<script setup lang="ts">
import { computed, ref, useId, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label?: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  { defaultExpanded: false, disabled: false, ariaLabel: 'Show more options' },
);

const emit = defineEmits<{ expandedChange: [expanded: boolean] }>();
const internal = ref(props.defaultExpanded);
const isExpanded = computed(() => (props.expanded !== undefined ? props.expanded : internal.value));
const panelId = useId();

function toggle() {
  if (props.disabled) return;
  const next = !isExpanded.value;
  if (props.expanded === undefined) internal.value = next;
  emit('expandedChange', next);
}
</script>

<template>
  <div :class="cn(styles.group, props.class)" :style="props.style">
    <div :class="styles.buttonRow">
      <div :class="styles.buttonContent">
        <div v-if="label" :class="styles.triangleLabel">{{ label }}</div>
        <slot />
      </div>
      <button
        v-if="$slots.detail"
        type="button"
        :class="styles.disclosureButton"
        :data-expanded="isExpanded ? 'true' : 'false'"
        :aria-expanded="isExpanded"
        :aria-controls="panelId"
        :aria-label="ariaLabel"
        :disabled="disabled"
        @click="toggle"
      >
        <svg :class="styles.disclosureButtonIcon" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
    <div v-if="$slots.detail && isExpanded" :id="panelId" :class="styles.buttonPanel" role="region" :aria-label="ariaLabel">
      <slot name="detail" />
    </div>
  </div>
</template>
