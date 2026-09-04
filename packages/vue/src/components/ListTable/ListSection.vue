<script setup lang="ts">
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
import { cn } from '../../utils/cn';
defineProps<{ header?: string; footer?: string; class?: string; style?: Record<string, string | number> }>();
</script>
<template>
  <section :class="cn(styles.section, $props.class)" :style="$props.style">
    <h3 v-if="header" :class="styles.sectionHeader">{{ header }}</h3>
    <ul :class="styles.sectionBody"><slot /></ul>
    <p v-if="footer" :class="styles.sectionFooter">{{ footer }}</p>
  </section>
</template>
