<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TypographyRole } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Typography/Typography.module.css';
  import { cn } from '../../utils/cn';

  type TypographyTag = 'h1' | 'h2' | 'h3' | 'p' | 'small' | 'span' | 'div' | 'label';

  const defaultElement: Record<TypographyRole, TypographyTag> = {
    display: 'h1',
    largeTitle: 'h1',
    title: 'h2',
    headline: 'h3',
    body: 'p',
    callout: 'p',
    subheadline: 'p',
    footnote: 'small',
    caption: 'span',
  };

  interface Props {
    role?: TypographyRole;
    as?: TypographyTag;
    children: Snippet;
    class?: string;
    style?: string;
    muted?: boolean;
  }

  let {
    role = 'body',
    as,
    children,
    class: className,
    style,
    muted = false,
  }: Props = $props();

  const tag = $derived(as ?? defaultElement[role]);
  const classNames = $derived(cn(styles.root, className));
  const mutedAttr = $derived(muted ? 'true' : undefined);
</script>

{#if tag === 'h1'}
  <h1 class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</h1>
{:else if tag === 'h2'}
  <h2 class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</h2>
{:else if tag === 'h3'}
  <h3 class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</h3>
{:else if tag === 'small'}
  <small class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</small>
{:else if tag === 'span'}
  <span class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</span>
{:else if tag === 'div'}
  <div class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</div>
{:else if tag === 'label'}
  <label class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</label>
{:else}
  <p class={classNames} {style} data-lr-type={role} data-muted={mutedAttr}>{@render children()}</p>
{/if}
