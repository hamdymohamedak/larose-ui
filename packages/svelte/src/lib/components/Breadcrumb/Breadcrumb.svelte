<script lang="ts">
  import { sanitizeNavigationUrl } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Breadcrumb/Breadcrumb.module.css';
  import { cn } from '../../utils/cn';

  export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
    current?: boolean;
  }

  interface Props {
    items: BreadcrumbItem[];
    class?: string;
    style?: string;
    ariaLabel?: string;
  }

  let { items, class: className, style, ariaLabel = 'Breadcrumb' }: Props = $props();
</script>

<nav class={cn(styles.nav, className)} {style} aria-label={ariaLabel}>
  <ol class={styles.list}>
    {#each items as item, index (item.label + index)}
      {@const isCurrent = item.current ?? index === items.length - 1}
      {@const safeHref = sanitizeNavigationUrl(item.href)}
      <li class={styles.item}>
        {#if isCurrent}
          <span class={styles.current} aria-current="page">{item.label}</span>
        {:else if safeHref}
          <a href={safeHref} class={styles.link} onclick={() => item.onClick?.()}>{item.label}</a>
        {:else if item.onClick}
          <button type="button" class={styles.linkButton} onclick={item.onClick}>{item.label}</button>
        {:else}
          <span class={styles.current}>{item.label}</span>
        {/if}
        {#if index < items.length - 1}
          <span class={styles.separator} aria-hidden="true">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
