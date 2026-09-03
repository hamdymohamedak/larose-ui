<script lang="ts">
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
  import {
    resolveToolbarPlacement,
    warnIfToolbarTitleTooLong,
  } from '../../Toolbar/utils';
  import type { ToolbarPlacement, ToolbarPlatform } from '../../Toolbar/types';
  import type { Snippet } from 'svelte';
  import { setToolbarPlatform } from '../../Toolbar/context';
  import ToolbarSection from './ToolbarSection.svelte';
  import ToolbarTitle from './ToolbarTitle.svelte';

  let {
    title,
    platform = 'macos',
    largeTitle = false,
    placement,
    hidden = false,
    class: className,
    style,
    'aria-label': ariaLabel,
    children,
  }: {
    title?: string;
    platform?: ToolbarPlatform;
    largeTitle?: boolean;
    placement?: ToolbarPlacement;
    hidden?: boolean;
    class?: string;
    style?: string;
    'aria-label'?: string;
    children?: Snippet;
  } = $props();

  setToolbarPlatform(() => platform);
  const resolvedPlacement = $derived(resolveToolbarPlacement(platform, placement));

  $effect(() => {
    if (title) warnIfToolbarTitleTooLong(title);
  });
</script>

<div
  role="toolbar"
  aria-label={ariaLabel ?? (title ? `${title} toolbar` : 'Toolbar')}
  class={[styles.toolbar, className].filter(Boolean).join(' ')}
  {style}
  data-platform={platform}
  data-placement={resolvedPlacement}
  data-large-title={largeTitle ? 'true' : undefined}
  data-hidden={hidden ? 'true' : undefined}
>
  {#if title && !children}
    <ToolbarSection placement="leading" collapsible={false}>
      {#snippet children()}
        <ToolbarTitle large={largeTitle} children={title!} />
      {/snippet}
    </ToolbarSection>
  {/if}
  {@render children?.()}
</div>
