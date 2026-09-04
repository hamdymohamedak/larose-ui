<script lang="ts">
  import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';
  import { cn } from '../../utils/cn';
  import { DEFAULT_SEARCH_PLACEHOLDER, filterSuggestions } from '../../SearchField/utils';
  import type { SearchToken } from '../../SearchField/types';

  interface Props {
    value?: string;
    placeholder?: string;
    suggestions?: string[];
    tokens?: SearchToken[];
    disabled?: boolean;
    class?: string;
    style?: string;
    ariaLabel?: string;
    onSubmit?: (value: string) => void;
    onRemoveToken?: (token: SearchToken) => void;
  }

  let {
    value = $bindable(''),
    placeholder = DEFAULT_SEARCH_PLACEHOLDER,
    suggestions = [],
    tokens = [],
    disabled,
    class: className,
    style,
    ariaLabel,
    onSubmit,
    onRemoveToken,
  }: Props = $props();

  let open = $state(false);
  const filtered = $derived(filterSuggestions(value, suggestions));
</script>

<div class={cn(styles.searchField, className)} {style}>
  <div class={styles.fieldRow}>
    <svg class={styles.searchIcon} viewBox="0 0 24 24" width="0.875rem" height="0.875rem" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.75" />
      <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
    </svg>
    {#if tokens.length}
      <div class={styles.tokens}>
        {#each tokens as token (token.id)}
          <button type="button" class={styles.token} onclick={() => onRemoveToken?.(token)}>
            <span>{token.label}</span>
            <span class={styles.tokenRemove} aria-hidden="true">×</span>
          </button>
        {/each}
      </div>
    {/if}
    <input
      class={styles.input}
      bind:value
      {placeholder}
      {disabled}
      aria-label={ariaLabel ?? placeholder}
      onfocus={() => (open = true)}
      onblur={() => (open = false)}
      onkeydown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit?.(value);
        }
      }}
    />
    {#if value}
      <button type="button" class={styles.clear} aria-label="Clear" onclick={() => (value = '')}>×</button>
    {/if}
  </div>
  {#if open && filtered.length}
    <ul class={styles.suggestions} role="listbox">
      {#each filtered as suggestion (suggestion)}
        <li>
          <button
            type="button"
            class={styles.suggestion}
            onmousedown={(e) => {
              e.preventDefault();
              value = suggestion;
              onSubmit?.(suggestion);
            }}
          >
            {suggestion}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
