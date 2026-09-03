<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { UIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/DataEntry/FieldShell.module.css';

  interface Props {
    label?: string;
    hint?: string;
    error?: string | null;
    required?: boolean;
    htmlFor?: string;
    uiState?: UIState;
    children: Snippet;
    class?: string;
    style?: string;
  }

  let {
    label,
    hint,
    error = null,
    required = false,
    htmlFor,
    uiState = 'idle',
    children,
    class: className,
    style,
  }: Props = $props();
</script>

<div class={[styles.wrapper, className].filter(Boolean).join(' ')} {style} data-state={uiState}>
  {#if label}
    <label for={htmlFor} class={styles.label}>
      {label}
      {#if required}
        <span class={styles.required} aria-hidden="true">*</span>
        <span class={styles.srOnly}>(required)</span>
      {/if}
    </label>
  {/if}
  {@render children()}
  {#if hint && !error}
    <span id={htmlFor ? `${htmlFor}-hint` : undefined} class={styles.hint}>{hint}</span>
  {/if}
  {#if error}
    <span id={htmlFor ? `${htmlFor}-error` : undefined} class={styles.error} role="alert">
      {error}
    </span>
  {/if}
</div>
