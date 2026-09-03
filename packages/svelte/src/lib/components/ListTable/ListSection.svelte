<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

  let {
    header,
    footer,
    class: className,
    style,
    children,
  }: { header?: string; footer?: string; class?: string; style?: string; children?: Snippet } = $props();
</script>

<section class={[styles.section, className].filter(Boolean).join(' ')} {style}>
  {#if header}<h3 class={styles.sectionHeader}>{header}</h3>{/if}
  <ul class={styles.sectionBody}>{@render children?.()}</ul>
  {#if footer}<p class={styles.sectionFooter}>{footer}</p>{/if}
</section>
