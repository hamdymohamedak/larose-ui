<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/WebView/WebView.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    canGoBack?: boolean;
    canGoForward?: boolean;
    title?: string;
    class?: string;
    style?: string;
    onBack?: () => void;
    onForward?: () => void;
    onReload?: () => void;
    children?: Snippet;
  }

  let {
    canGoBack,
    canGoForward,
    title,
    class: className,
    style,
    onBack,
    onForward,
    onReload,
    children,
  }: Props = $props();
</script>

<div class={cn(styles.toolbar, className)} {style} role="toolbar" aria-label="Web navigation">
  <button type="button" class={styles.navButton} disabled={!canGoBack} aria-label="Back" onclick={onBack}>‹</button>
  <button type="button" class={styles.navButton} disabled={!canGoForward} aria-label="Forward" onclick={onForward}>›</button>
  <button type="button" class={styles.navButton} aria-label="Reload" onclick={onReload}>↻</button>
  {#if title}<span class={styles.toolbarTitle}>{title}</span>{/if}
  {#if children}{@render children()}{/if}
</div>
