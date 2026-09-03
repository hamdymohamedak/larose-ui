<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
  import { cn } from '../../utils/cn';
  import type { LockupAxis } from '../../Lockup/types';

  interface Props {
    axis?: LockupAxis;
    focused?: boolean;
    class?: string;
    style?: string;
    ariaLabel?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onclick?: () => void;
    header?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  }

  let {
    axis = 'horizontal',
    focused = false,
    class: className,
    style,
    ariaLabel,
    onFocus,
    onBlur,
    onclick,
    header,
    footer,
    children,
  }: Props = $props();
</script>

<button
  type="button"
  class={cn(styles.lockup, className)}
  {style}
  data-axis={axis}
  data-focused={focused ? 'true' : undefined}
  aria-label={ariaLabel}
  onfocus={onFocus}
  onblur={onBlur}
  {onclick}
>
  {#if header}<div class={styles.header}>{@render header()}</div>{/if}
  <div class={styles.content}>{#if children}{@render children()}{/if}</div>
  {#if footer}<div class={styles.footer}>{@render footer()}</div>{/if}
</button>
