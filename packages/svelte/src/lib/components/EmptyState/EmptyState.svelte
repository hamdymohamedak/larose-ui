<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { UIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/EmptyState/EmptyState.module.css';
  import Button from '../Button/Button.svelte';
  import { cn } from '../../utils/cn';

  interface Props {
    title: string;
    description?: string;
    icon?: Snippet;
    actionLabel?: string;
    onAction?: () => void;
    state?: UIState;
    class?: string;
    style?: string;
  }

  let {
    title,
    description,
    icon,
    actionLabel,
    onAction,
    state = 'empty',
    class: className,
    style,
  }: Props = $props();
</script>

<div class={cn(styles.empty, className)} {style} data-state={state} role="status">
  {#if icon}
    <div class={styles.icon}>{@render icon()}</div>
  {/if}
  <h3 class={styles.title}>{title}</h3>
  {#if description}
    <p class={styles.description}>{description}</p>
  {/if}
  {#if actionLabel && onAction}
    <div class={styles.action}>
      <Button variant="primary" onclick={onAction}>{actionLabel}</Button>
    </div>
  {/if}
</div>
