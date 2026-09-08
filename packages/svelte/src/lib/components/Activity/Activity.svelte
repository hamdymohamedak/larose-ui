<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Activity/Activity.module.css';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
</script>

<!-- TODO: implement Activity for @larose-ui/svelte -->
<div class={[styles.root, className].filter(Boolean).join(' ')} data-larose="Activity">
  {#if children}
    {@render children()}
  {/if}
</div>
