<script lang="ts">
  import styles from '@larose-ui/styles/components/TokenField/TokenField.module.css';
  import { cn } from '../../utils/cn';
  import {
    filterTokenSuggestions,
    mergeUniqueTokens,
    tokenizeInput,
  } from '../../TokenField/utils';
  import type { TokenFieldToken } from '../../TokenField/types';

  interface Props {
    tokens?: TokenFieldToken[];
    value?: TokenFieldToken[];
    suggestions?: TokenFieldToken[];
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    style?: string;
    onTokensChange?: (tokens: TokenFieldToken[]) => void;
  }

  let {
    tokens = $bindable<TokenFieldToken[] | undefined>(undefined),
    value = $bindable<TokenFieldToken[] | undefined>(undefined),
    suggestions = [],
    placeholder = 'Add…',
    disabled,
    class: className,
    style,
    onTokensChange,
  }: Props = $props();

  let draft = $state('');
  const delimiters = [',', ';'];
  const current = $derived(tokens ?? value ?? []);
  const filtered = $derived(filterTokenSuggestions(draft, suggestions));

  function setTokens(next: TokenFieldToken[]) {
    tokens = next;
    value = next;
    onTokensChange?.(next);
  }

  function commit(raw: string) {
    setTokens(mergeUniqueTokens(current, tokenizeInput(raw, delimiters)));
    draft = '';
  }

  function remove(id: string) {
    setTokens(current.filter((token) => token.id !== id));
  }
</script>

<div class={cn(styles.field, className)} {style}>
  {#each current as token (token.id)}
    <button type="button" class={styles.token} onclick={() => remove(token.id)}>
      {token.label}
      <span class={styles.tokenRemove} aria-hidden="true">×</span>
    </button>
  {/each}
  <input
    class={styles.input}
    bind:value={draft}
    {placeholder}
    {disabled}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        commit(draft);
      }
    }}
  />
  {#if filtered.length}
    <ul class={styles.suggestions}>
      {#each filtered as suggestion (suggestion.id)}
        <li>
          <button
            type="button"
            class={styles.suggestion}
            onmousedown={(e) => {
              e.preventDefault();
              commit(suggestion.label);
            }}
          >
            {suggestion.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
