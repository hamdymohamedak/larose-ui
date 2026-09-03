<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';
  import { cn } from '../../utils/cn';

  let {
    active = false,
    disabled = false,
    class: className,
    children,
    onclick,
    ...rest
  }: {
    active?: boolean;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
    onclick?: (event: MouseEvent) => void;
    [key: string]: unknown;
  } = $props();
</script>

<button
  type="button"
  class={cn(styles.borderlessButton, className)}
  data-active={active ? 'true' : undefined}
  {disabled}
  {onclick}
  {...rest}
>
  {#if children}{@render children()}{/if}
</button>
