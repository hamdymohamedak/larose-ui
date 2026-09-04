<script lang="ts">
  import ShareIcon from './ShareIcon.svelte';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  let {
    label = 'Share',
    class: className,
    onclick,
    ...rest
  }: { label?: string; class?: string; onclick?: (event: MouseEvent) => void; [key: string]: unknown } = $props();
</script>

<button type="button" class={[styles.toolbarButton, className].filter(Boolean).join(' ')} aria-label={label} {onclick} {...rest}>
  <ShareIcon />
</button>
