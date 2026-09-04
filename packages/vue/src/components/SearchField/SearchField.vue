<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';
import { cn } from '../../utils/cn';
import { DEFAULT_SEARCH_PLACEHOLDER, filterSuggestions } from '../../SearchField/utils';
import type { SearchToken } from '../../SearchField/types';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    suggestions?: string[];
    tokens?: SearchToken[];
    disabled?: boolean;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  { modelValue: '', placeholder: DEFAULT_SEARCH_PLACEHOLDER, suggestions: () => [], tokens: () => [] },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [value: string];
  removeToken: [token: SearchToken];
}>();

const open = ref(false);
const filtered = computed(() => filterSuggestions(props.modelValue ?? '', props.suggestions));
</script>

<template>
  <div :class="cn(styles.searchField, props.class)" :style="props.style">
    <div :class="styles.fieldRow">
      <svg :class="styles.searchIcon" viewBox="0 0 24 24" width="0.875rem" height="0.875rem" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.75" />
        <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
      <div v-if="tokens.length" :class="styles.tokens">
        <button
          v-for="token in tokens"
          :key="token.id"
          type="button"
          :class="styles.token"
          @click="emit('removeToken', token)"
        >
          <span>{{ token.label }}</span>
          <span :class="styles.tokenRemove" aria-hidden="true">×</span>
        </button>
      </div>
      <input
        :class="styles.input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="ariaLabel ?? placeholder"
        @focus="open = true"
        @blur="open = false"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown.enter.prevent="emit('submit', modelValue ?? '')"
      />
      <button
        v-if="modelValue"
        type="button"
        :class="styles.clear"
        aria-label="Clear"
        @click="emit('update:modelValue', '')"
      >
        ×
      </button>
    </div>
    <ul v-if="open && filtered.length" :class="styles.suggestions" role="listbox">
      <li v-for="suggestion in filtered" :key="suggestion">
        <button
          type="button"
          :class="styles.suggestion"
          @mousedown.prevent="
            emit('update:modelValue', suggestion);
            emit('submit', suggestion);
          "
        >
          {{ suggestion }}
        </button>
      </li>
    </ul>
  </div>
</template>
