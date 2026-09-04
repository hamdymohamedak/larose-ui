<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Tooltip/Tooltip.module.css';
  import { cn } from '../../utils/cn';

  export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

  interface Props {
    content: string | Snippet;
    children: Snippet;
    side?: TooltipSide;
    class?: string;
    style?: string;
  }

  let { content, children, side = 'top', class: className, style }: Props = $props();

  let visible = $state(false);
  const tooltipId = `lr-tooltip-${Math.random().toString(36).slice(2, 9)}`;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class={cn(styles.wrapper, className)}
  {style}
  role="group"
  onmouseenter={() => (visible = true)}
  onmouseleave={() => (visible = false)}
  onfocuscapture={() => (visible = true)}
  onblurcapture={() => (visible = false)}
>
  <span aria-describedby={visible ? tooltipId : undefined}>{@render children()}</span>
  {#if visible}
    <span id={tooltipId} role="tooltip" class={styles.tooltip} data-side={side}>
      {#if typeof content === 'function'}
        {@render content()}
      {:else}
        {content}
      {/if}
    </span>
  {/if}
</span>
