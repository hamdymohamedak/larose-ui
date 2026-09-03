<script setup lang="ts">
import { computed, ref, useId, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    class?: string;
    style?: CSSProperties;
  }>(),
  { defaultExpanded: false, disabled: false },
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
    <div :class="styles.row">
      <button
        type="button"
        :class="styles.triangleButton"
        :data-expanded="isExpanded ? 'true' : 'false'"
        :aria-expanded="isExpanded"
        :aria-controls="$slots.default ? panelId : undefined"
        :aria-label="`${label}, ${isExpanded ? 'expanded' : 'collapsed'}`"
        :disabled="disabled"
        @click="toggle"
      >
        <svg :class="styles.triangleIcon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M4.5 3.25 7.5 6 4.5 8.75"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span :class="styles.triangleLabel">{{ label }}</span>
    </div>
    <div v-if="$slots.default && isExpanded" :id="panelId" :class="styles.panel" role="region" :aria-label="label">
      <slot />
    </div>
  </div>
</template>
