<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ButtonRole, Size, UIState, Variant } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Button/Button.module.css';
  import Spinner from '../Spinner/Spinner.svelte';
  import { cn } from '../../utils/cn';
  import { getComponentDefaults } from '../../theme/context';
  import { resolveButtonShape, type ButtonShape } from '../../button/utils';

  interface Props {
    variant?: Variant;
    size?: Size;
    buttonRole?: ButtonRole;
    shape?: ButtonShape;
    state?: UIState;
    loading?: boolean;
    loadingLabel?: string;
    error?: string | null;
    disabled?: boolean;
    iconOnly?: boolean;
    fullWidth?: boolean;
    flexible?: boolean;
    tooltip?: string;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    style?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    leftIcon?: Snippet;
    rightIcon?: Snippet;
  }

  let props: Props = $props();

  const merged = $derived(getComponentDefaults('Button', props));
  const uiState = $derived(
    resolveUIState({
      state: merged.state,
      loading: merged.loading,
      error: merged.error,
      disabled: merged.disabled,
    }),
  );
  const isDisabled = $derived(
    merged.disabled || uiState === 'loading' || uiState === 'disabled',
  );
  const isLoading = $derived(uiState === 'loading');
  const hasText = $derived(Boolean(merged.children));
  const hasIcon = $derived(Boolean(merged.leftIcon || merged.rightIcon));
  const resolvedShape = $derived(
    resolveButtonShape({
      shape: merged.shape,
      iconOnly: merged.iconOnly,
      hasText: hasText && !isLoading,
      hasIcon,
    }),
  );
  const resolvedVariant = $derived(
    merged.buttonRole === 'primary' && merged.variant !== 'destructive'
      ? 'primary'
      : merged.variant,
  );
</script>

<button
  type={merged.type ?? 'button'}
  class={cn(styles.button, merged.class)}
  style={merged.style}
  data-variant={resolvedVariant}
  data-size={merged.size ?? 'md'}
  data-shape={resolvedShape}
  data-role={merged.buttonRole !== 'normal' ? merged.buttonRole : undefined}
  data-state={uiState}
  data-flexible={merged.flexible ? 'true' : undefined}
  data-full-width={merged.fullWidth ? 'true' : undefined}
  disabled={isDisabled}
  aria-busy={isLoading}
  aria-disabled={isDisabled}
  title={merged.tooltip && !isDisabled ? merged.tooltip : undefined}
  onclick={merged.onclick}
>
  {#if isLoading}
    <span class={styles.spinner} aria-hidden="true">
      <Spinner size="sm" />
    </span>
  {/if}
  {#if !isLoading && merged.leftIcon}
    <span class={styles.icon}>{@render merged.leftIcon()}</span>
  {/if}
  {#if (hasText || isLoading) && merged.children}
    <span class={styles.content}>
      {#if isLoading && merged.loadingLabel}
        {merged.loadingLabel}
      {:else}
        {@render merged.children()}
      {/if}
    </span>
  {/if}
  {#if !isLoading && merged.rightIcon}
    <span class={styles.icon}>{@render merged.rightIcon()}</span>
  {/if}
  {#if uiState === 'error' && merged.error}
    <span class={styles.errorMessage} role="alert">{merged.error}</span>
  {/if}
</button>
