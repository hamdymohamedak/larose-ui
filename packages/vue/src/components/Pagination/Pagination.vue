<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Pagination/Pagination.module.css';
import { cn } from '../../utils/cn';
import { getPageItems } from './pageItems';

const props = withDefaults(
  defineProps<{
    page: number;
    totalPages: number;
    siblingCount?: number;
    previousLabel?: string;
    nextLabel?: string;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  {
    siblingCount: 1,
    previousLabel: 'Previous page',
    nextLabel: 'Next page',
    ariaLabel: 'Pagination',
  },
);

const emit = defineEmits<{ pageChange: [page: number] }>();
const items = computed(() => getPageItems(props.page, props.totalPages, props.siblingCount));
</script>

<template>
  <nav
    v-if="totalPages >= 1"
    :class="cn(styles.pagination, props.class)"
    :style="props.style"
    :aria-label="ariaLabel"
  >
    <button
      type="button"
      :class="styles.pageButton"
      :disabled="page <= 1"
      :aria-label="previousLabel"
      @click="emit('pageChange', page - 1)"
    >
      ‹
    </button>
    <template v-for="(item, index) in items" :key="`${item}-${index}`">
      <span v-if="item === 'ellipsis'" :class="styles.ellipsis" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        :class="styles.pageButton"
        :data-state="item === page ? 'active' : undefined"
        :aria-current="item === page ? 'page' : undefined"
        @click="emit('pageChange', item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      :class="styles.pageButton"
      :disabled="page >= totalPages"
      :aria-label="nextLabel"
      @click="emit('pageChange', page + 1)"
    >
      ›
    </button>
  </nav>
</template>
