<script setup lang="ts">
import { computed } from 'vue';
import { sanitizeNavigationUrl } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';
const props = withDefaults(defineProps<{
  href?: string; active?: boolean; disabled?: boolean; badge?: number | '!'; accentColor?: string;
  class?: string; style?: Record<string, string | number>;
}>(), { active: false, disabled: false });
const emit = defineEmits<{ click: [] }>();
const state = computed(() => props.disabled ? 'disabled' : props.active ? 'active' : 'inactive');
const safeHref = computed(() => props.href && !props.disabled ? sanitizeNavigationUrl(props.href) : null);
</script>
<template>
  <a v-if="safeHref" :href="safeHref" :class="cn(styles.item, props.class)" :style="props.style" :data-state="state" :aria-current="active ? 'page' : undefined">
    <span v-if="$slots.icon" :class="styles.itemIcon" :style="accentColor ? { color: accentColor } : undefined"><slot name="icon" /></span>
    <span :class="styles.itemLabel"><slot /></span>
    <span v-if="badge !== undefined" :class="styles.itemBadge" :aria-label="typeof badge === 'number' ? `${badge} items` : 'Important'">{{ badge }}</span>
  </a>
  <button v-else type="button" :class="cn(styles.item, props.class)" :style="props.style" :data-state="state" :aria-current="active ? 'page' : undefined" :disabled="disabled" @click="emit('click')">
    <span v-if="$slots.icon" :class="styles.itemIcon" :style="accentColor ? { color: accentColor } : undefined"><slot name="icon" /></span>
    <span :class="styles.itemLabel"><slot /></span>
    <span v-if="badge !== undefined" :class="styles.itemBadge" :aria-label="typeof badge === 'number' ? `${badge} items` : 'Important'">{{ badge }}</span>
  </button>
</template>
