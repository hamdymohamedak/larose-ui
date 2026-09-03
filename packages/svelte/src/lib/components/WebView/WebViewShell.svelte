<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/WebView/WebView.module.css';
  import { cn } from '../../utils/cn';
  import WebView from './WebView.svelte';
  import WebViewNavigation from './WebViewNavigation.svelte';

  interface Props {
    src: string;
    title?: string;
    canGoBack?: boolean;
    canGoForward?: boolean;
    class?: string;
    style?: string;
    onBack?: () => void;
    onForward?: () => void;
    onReload?: () => void;
    toolbar?: Snippet;
  }

  let {
    src,
    title,
    canGoBack,
    canGoForward,
    class: className,
    style,
    onBack,
    onForward,
    onReload,
    toolbar,
  }: Props = $props();
</script>

<div class={cn(styles.shell, className)} {style}>
  <WebViewNavigation {title} {canGoBack} {canGoForward} {onBack} {onForward} {onReload}>
    {#snippet children()}
      {#if toolbar}{@render toolbar()}{/if}
    {/snippet}
  </WebViewNavigation>
  <div class={styles.frame}>
    <WebView {src} {title} />
  </div>
</div>
