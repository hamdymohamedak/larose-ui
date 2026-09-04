<script lang="ts">
  import type { Snippet } from 'svelte';
  import { sanitizeNavigationUrl } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    href,
    active = false,
    disabled = false,
    icon,
    badge,
    accentColor,
    onclick,
    class: className,
    style,
    children,
  }: {
    href?: string;
    active?: boolean;
    disabled?: boolean;
    icon?: Snippet;
    badge?: number | '!';
    accentColor?: string;
    onclick?: () => void;
    class?: string;
    style?: string;
    children?: Snippet;
  } = $props();

  const state = $derived(disabled ? 'disabled' : active ? 'active' : 'inactive');
  const safeHref = $derived(href && !disabled ? sanitizeNavigationUrl(href) : null);
</script>

{#snippet content()}
  {#if icon}
    <span class={styles.itemIcon} style={accentColor ? `color:${accentColor}` : undefined}
      >{@render icon()}</span
    >
  {/if}
  <span class={styles.itemLabel}>{@render children?.()}</span>
  {#if badge !== undefined}
    <span
      class={styles.itemBadge}
      aria-label={typeof badge === 'number' ? `${badge} items` : 'Important'}>{badge === '!' ? '!' : badge}</span
    >
  {/if}
{/snippet}

{#if href && !disabled && safeHref}
  <a
    href={safeHref}
    class={[styles.item, className].filter(Boolean).join(' ')}
    {style}
    data-state={state}
    aria-current={active ? 'page' : undefined}>{@render content()}</a
  >
{:else}
  <button
    type="button"
    class={[styles.item, className].filter(Boolean).join(' ')}
    {style}
    data-state={state}
    aria-current={active ? 'page' : undefined}
    {disabled}
    {onclick}>{@render content()}</button
  >
{/if}
