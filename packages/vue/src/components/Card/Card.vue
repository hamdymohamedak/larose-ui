<script setup lang="ts">
import styles from '@larose-ui/styles/components/Card/Card.module.css';
import { cn } from '../../utils/cn';
import { useComponentDefaults } from '../../composables/useComponentDefaults';

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    class?: string;
  }>(),
  {
    padding: 'md',
  },
);

const merged = useComponentDefaults('Card', props);
</script>

<template>
  <article :class="cn(styles.card, merged.class)" :data-padding="merged.padding">
    <slot />
    <template v-if="!$slots.default">
      <header v-if="merged.title || merged.description" :class="styles.header">
        <h3 v-if="merged.title" :class="styles.title">{{ merged.title }}</h3>
        <p v-if="merged.description" :class="styles.description">{{ merged.description }}</p>
      </header>
      <div v-if="$slots.body" :class="styles.body">
        <slot name="body" />
      </div>
      <footer v-if="$slots.footer" :class="styles.footer">
        <slot name="footer" />
      </footer>
    </template>
  </article>
</template>
