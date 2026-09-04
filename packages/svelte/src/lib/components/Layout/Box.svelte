<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Layout/Layout.module.css';
  import { cn } from '../../utils/cn';
  import { formatBoxTitle } from '../../Layout/utils';
  import type { BoxTitlePosition, BoxVariant } from '../../Layout/types';

  interface Props {
    title?: string;
    settingsStyle?: boolean;
    titlePosition?: BoxTitlePosition;
    variant?: BoxVariant;
    padding?: 'sm' | 'md' | 'lg';
    class?: string;
    style?: string;
    ariaLabel?: string;
    children?: Snippet;
  }

  let {
    title,
    settingsStyle = false,
    titlePosition = 'inside',
    variant = 'secondary',
    padding = 'md',
    class: className,
    style,
    ariaLabel,
    children,
  }: Props = $props();

  const formattedTitle = $derived(title ? formatBoxTitle(title, settingsStyle) : undefined);
</script>

<section class={cn(styles.boxWrapper, className)} {style} aria-label={ariaLabel ?? formattedTitle}>
  {#if formattedTitle && titlePosition === 'above'}
    <h3 class={styles.titleAbove}>{formattedTitle}</h3>
  {/if}
  <div class={styles.box} data-variant={variant} data-padding={padding}>
    {#if formattedTitle && titlePosition === 'inside'}
      <h3 class={styles.titleInside}>{formattedTitle}</h3>
    {/if}
    <div class={styles.content}>
      {#if children}{@render children()}{/if}
    </div>
  </div>
</section>
