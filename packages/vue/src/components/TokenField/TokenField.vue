<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/TokenField/TokenField.module.css';
import { cn } from '../../utils/cn';
import {
  filterTokenSuggestions,
  mergeUniqueTokens,
  tokenizeInput,
} from '../../TokenField/utils';
import type { TokenFieldToken } from '../../TokenField/types';

const props = withDefaults(
  defineProps<{
    modelValue?: TokenFieldToken[];
    suggestions?: TokenFieldToken[];
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    style?: CSSProperties;
  }>(),
  { modelValue: () => [], suggestions: () => [], placeholder: 'Add…' },
);

const emit = defineEmits<{ 'update:modelValue': [tokens: TokenFieldToken[]] }>();
const draft = ref('');
const delimiters = [',', ';'];
const filtered = computed(() => filterTokenSuggestions(draft.value, props.suggestions));

function commit(raw: string) {
  const next = mergeUniqueTokens(props.modelValue ?? [], tokenizeInput(raw, delimiters));
  emit('update:modelValue', next);
  draft.value = '';
}

function remove(id: string) {
  emit(
    'update:modelValue',
    (props.modelValue ?? []).filter((token) => token.id !== id),
  );
}
</script>

<template>
  <div :class="cn(styles.field, props.class)" :style="props.style">
    <button
      v-for="token in modelValue"
      :key="token.id"
      type="button"
      :class="styles.token"
      @click="remove(token.id)"
    >
      {{ token.label }}
      <span :class="styles.tokenRemove" aria-hidden="true">×</span>
    </button>
    <input
      :class="styles.input"
      :value="draft"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="draft = ($event.target as HTMLInputElement).value"
      @keydown.enter.prevent="commit(draft)"
      @keydown.,.prevent="commit(draft)"
    />
    <ul v-if="filtered.length" :class="styles.suggestions">
      <li v-for="suggestion in filtered" :key="suggestion.id">
        <button type="button" :class="styles.suggestion" @mousedown.prevent="commit(suggestion.label)">
          {{ suggestion.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
