<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getToolbarPlatform } from '../../Toolbar/context';
  import ToolbarProminentButton from './ToolbarProminentButton.svelte';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    label,
    icon,
    showLabel = false,
    prominent = false,
    disabled = false,
    onclick,
    class: className,
    style,
  }: {
    id?: string;
    label: string;
    icon?: Snippet;
    showLabel?: boolean;
    prominent?: boolean;
    disabled?: boolean;
    onclick?: () => void;
    class?: string;
    style?: string;
  } = $props();

  const platform = $derived(getToolbarPlatform());
</script>

{#if prominent}
  <ToolbarProminentButton {onclick} {disabled} class={className} {style} children={label} />
{:else}
  <button
    type="button"
    class={[styles.item, className].filter(Boolean).join(' ')}
    {style}
    data-platform={platform}
    data-show-label={showLabel ? 'true' : undefined}
    aria-label={showLabel ? undefined : label}
    {disabled}
    {onclick}
  >
    {#if icon}<span class={styles.itemIcon}>{@render icon()}</span>{/if}
    {#if showLabel}<span>{label}</span>{/if}
  </button>
{/if}
