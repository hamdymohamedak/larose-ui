<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ButtonRole, Size, Variant } from '@larose-ui/core';
  import type { ButtonShape } from '../../button/utils';
  import Button from '../Button/Button.svelte';

  interface Props {
    complete: boolean;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
    buttonRole?: ButtonRole;
    shape?: ButtonShape;
    fullWidth?: boolean;
    class?: string;
    style?: string;
    children?: Snippet;
  }

  let {
    complete,
    disabled,
    variant,
    size,
    buttonRole,
    shape,
    fullWidth,
    class: className,
    style,
    children,
  }: Props = $props();
</script>

<Button
  type="submit"
  disabled={disabled || !complete}
  {variant}
  {size}
  {buttonRole}
  {shape}
  {fullWidth}
  class={className}
  {style}
>
  {#if children}
    {@render children()}
  {:else}
    Continue
  {/if}
</Button>
