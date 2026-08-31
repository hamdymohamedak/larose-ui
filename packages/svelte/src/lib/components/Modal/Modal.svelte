<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import styles from '@larose-ui/styles/components/Modal/Modal.module.css';
  import { cn } from '../../utils/cn';
  import { getComponentDefaults } from '../../theme/context';

  interface Props {
    open: boolean;
    title?: string;
    description?: string;
    closeOnOverlay?: boolean;
    class?: string;
    overlayClass?: string;
    contentClass?: string;
    onclose?: () => void;
    children: Snippet;
  }

  let props: Props = $props();
  const merged = $derived(getComponentDefaults('Modal', props));

  let dialogEl = $state<HTMLDivElement | null>(null);
  let previousFocus = $state<HTMLElement | null>(null);

  function close() {
    merged.onclose?.();
  }

  function onOverlayClick() {
    if (merged.closeOnOverlay !== false) close();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }

  $effect(() => {
    if (!merged.open) return;
    previousFocus = document.activeElement as HTMLElement;
    queueMicrotask(() => {
      const focusable = dialogEl?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    });
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
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class={cn(styles.overlay, merged.overlayClass)}
    role="presentation"
    onclick={(event) => {
      if (event.currentTarget === event.target) onOverlayClick();
    }}
  >
    <div
      bind:this={dialogEl}
      class={cn(styles.dialog, merged.class)}
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby={merged.title ? 'larose-modal-title' : undefined}
      aria-describedby={merged.description ? 'larose-modal-description' : undefined}
      onclick={(e) => e.stopPropagation()}
    >
      <div class={cn(styles.content, merged.contentClass)}>
        {#if merged.title || merged.description}
          <header class={styles.header}>
            {#if merged.title}
              <h2 id="larose-modal-title" class={styles.title}>{merged.title}</h2>
            {/if}
            {#if merged.description}
              <p id="larose-modal-description" class={styles.description}>{merged.description}</p>
            {/if}
          </header>
        {/if}
        {@render merged.children()}
      </div>
    </div>
  </div>
{/if}
