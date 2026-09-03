<script setup lang="ts">
import { ref, useId } from 'vue';
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';
const props = withDefaults(defineProps<{ label: string; defaultExpanded?: boolean; class?: string; style?: Record<string, string | number> }>(), { defaultExpanded: true });
const panelId = useId();
const expanded = ref(props.defaultExpanded);
</script>
<template>
  <div :class="cn(styles.disclosureSection, props.class)" :style="props.style">
    <button type="button" :class="styles.disclosureTrigger" :aria-expanded="expanded" :aria-controls="panelId" @click="expanded = !expanded">
      <svg :class="styles.disclosureChevron" :data-expanded="expanded ? 'true' : 'false'" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M4.5 3.25 7.5 6 4.5 8.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span :class="styles.disclosureLabel">{{ label }}</span>
    </button>
    <div v-if="expanded" :id="panelId" :class="styles.disclosureContent" role="group" :aria-label="label"><slot /></div>
  </div>
</template>
