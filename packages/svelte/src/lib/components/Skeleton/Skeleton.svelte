<script lang="ts">
  import styles from '@larose-ui/styles/components/Skeleton/Skeleton.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    lines?: number;
    class?: string;
    style?: string;
  }

  let {
    width = '100%',
    height = '1rem',
    variant = 'text',
    lines = 1,
    class: className,
    style,
  }: Props = $props();

  function cssSize(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  const widthCss = $derived(cssSize(width));
  const heightCss = $derived(cssSize(height));
</script>

{#if lines > 1}
  <div class={cn(styles.group, className)} {style} aria-hidden="true">
    {#each Array.from({ length: lines }) as _, i}
      <div
        class={styles.skeleton}
        data-variant="text"
        style="width:{i === lines - 1 ? '70%' : widthCss};height:{heightCss}"
      ></div>
    {/each}
  </div>
{:else}
  <div
    class={cn(styles.skeleton, className)}
    data-variant={variant}
    style="width:{widthCss};height:{variant === 'circular' ? widthCss : heightCss};{style ?? ''}"
    aria-hidden="true"
  ></div>
{/if}
