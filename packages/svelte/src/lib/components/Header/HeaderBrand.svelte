<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Header/Header.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    class?: string;
    style?: string;
    children?: Snippet;
  }

  let { class: className, style, children }: Props = $props();
</script>

<div class={cn(styles.brand, className)} {style}>
  {#if children}{@render children()}{/if}
</div>
