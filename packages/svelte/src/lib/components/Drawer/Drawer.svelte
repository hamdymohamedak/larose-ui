<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import styles from '@larose-ui/styles/components/Drawer/Drawer.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';
  import { getComponentDefaults } from '../../theme/context';

  export type DrawerSide = 'left' | 'right';

  interface Props {
    open: boolean;
    onclose?: () => void;
    children: Snippet;
    title?: string;
    description?: string;
    side?: DrawerSide;
    closeOnOverlay?: boolean;
    class?: string;
    overlayClass?: string;
    panelClass?: string;
    style?: string;
  }

  let props: Props = $props();
  const merged = $derived(getComponentDefaults('Drawer', props));

  let panelEl = $state<HTMLElement | null>(null);
  let previousFocus = $state<HTMLElement | null>(null);

  function close() {
    merged.onclose?.();
  }

  function onOverlayClick(event: MouseEvent) {
    if (merged.closeOnOverlay !== false && event.target === event.currentTarget) close();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }

  $effect(() => {
    if (!merged.open) return;
    previousFocus = document.activeElement as HTMLElement;
    queueMicrotask(() => panelEl?.focus());
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  });

  onMount(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });
</script>

{#if merged.open}
  <div
    use:portal
    class={cn(styles.overlay, merged.overlayClass)}
    style={merged.style}
    role="presentation"
    onclick={onOverlayClick}
  >
    <div
      bind:this={panelEl}
      class={cn(styles.panel, merged.panelClass, merged.class)}
      data-side={merged.side ?? 'right'}
      role="dialog"
      aria-modal="true"
      aria-labelledby={merged.title ? 'lr-drawer-title' : undefined}
      aria-describedby={merged.description ? 'lr-drawer-desc' : undefined}
      tabindex="-1"
    >
      {#if merged.title}
        <h2 id="lr-drawer-title" class={styles.title}>{merged.title}</h2>
      {/if}
      {#if merged.description}
        <p id="lr-drawer-desc" class={styles.description}>{merged.description}</p>
      {/if}
      <div class={styles.content}>{@render merged.children()}</div>
    </div>
  </div>
{/if}
