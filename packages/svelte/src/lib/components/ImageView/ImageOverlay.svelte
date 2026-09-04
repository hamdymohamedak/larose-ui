<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    src: string;
    alt: string;
    class?: string;
    style?: string;
    children?: Snippet;
  }

  let { src, alt, class: className, style, children }: Props = $props();
</script>

<div class={cn(styles.overlay, className)} {style}>
  <img {src} alt={alt} class={styles.overlayImage} />
  <div class={styles.overlayScrim} aria-hidden="true"></div>
  <div class={styles.overlayContent}>{#if children}{@render children()}{/if}</div>
</div>
