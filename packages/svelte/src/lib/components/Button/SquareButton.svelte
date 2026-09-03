<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Button/Button.module.css';
  import Tooltip from '../Tooltip/Tooltip.svelte';
  import { cn } from '../../utils/cn';

  interface Props {
    icon: Snippet;
    tooltip?: string;
    pressed?: boolean;
    class?: string;
    style?: string;
    disabled?: boolean;
    'aria-label'?: string;
    onclick?: (event: MouseEvent) => void;
  }

  let {
    icon,
    tooltip,
    pressed = false,
    class: className,
    style,
    disabled,
    'aria-label': ariaLabel,
    onclick,
  }: Props = $props();
</script>

{#snippet button()}
  <button
    type="button"
    class={cn(styles.squareButton, className)}
    {style}
    data-pressed={pressed ? 'true' : undefined}
    aria-label={ariaLabel}
    aria-pressed={pressed ? 'true' : undefined}
    {disabled}
    {onclick}
  >
    <span class={styles.squareButtonIcon}>{@render icon()}</span>
  </button>
{/snippet}

{#if tooltip}
  <Tooltip content={tooltip}>
    {@render button()}
  </Tooltip>
{:else}
  {@render button()}
{/if}
