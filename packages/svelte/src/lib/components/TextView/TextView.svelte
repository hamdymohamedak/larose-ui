<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TypographyRole } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/TextView/TextView.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    editable?: boolean;
    selectable?: boolean;
    maxHeight?: string;
    typographyRole?: TypographyRole;
    value?: string;
    class?: string;
    style?: string;
    disabled?: boolean;
    children?: Snippet;
  }

  let {
    editable = false,
    selectable = true,
    maxHeight,
    typographyRole = 'body',
    value = $bindable(''),
    class: className,
    style,
    disabled,
    children,
  }: Props = $props();
</script>

<div
  class={cn(styles.view, className)}
  style={`max-height:${maxHeight ?? ''};${style ?? ''}`}
  data-lr-type={typographyRole}
  data-selectable={selectable ? 'true' : undefined}
>
  {#if editable}
    <textarea class={styles.editable} bind:value {disabled}></textarea>
  {:else}
    <div class={cn(styles.display, maxHeight ? styles.scrollable : undefined)}>
      {#if children}{@render children()}{:else}{value}{/if}
    </div>
  {/if}
</div>
