<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  export type SidebarPlatform = 'ios' | 'ipados' | 'macos' | 'visionos';
  export type SidebarSize = 'small' | 'medium' | 'large';

  let {
    platform = 'macos',
    size = 'medium',
    hidden = false,
    glass = true,
    height,
    maxHeight,
    'aria-label': ariaLabel = 'Sidebar',
    class: className,
    style = '',
    children,
  }: {
    platform?: SidebarPlatform;
    size?: SidebarSize;
    hidden?: boolean;
    glass?: boolean;
    height?: string;
    maxHeight?: string;
    'aria-label'?: string;
    class?: string;
    style?: string;
    children?: Snippet;
  } = $props();

  const mergedStyle = $derived(
    [
      style,
      height ? `--lr-sidebar-height:${height}` : '',
      maxHeight ? `--lr-sidebar-max-height:${maxHeight}` : '',
    ]
      .filter(Boolean)
      .join(';'),
  );
</script>

{#if !hidden}
  <aside
    class={[styles.sidebar, className].filter(Boolean).join(' ')}
    aria-label={ariaLabel}
    data-platform={platform}
    data-size={size}
    data-glass={glass ? 'true' : undefined}
    style={mergedStyle}
  >
    {@render children?.()}
  </aside>
{/if}
