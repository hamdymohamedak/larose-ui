<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Popover/Popover.module.css';
  import { cn } from '../../utils/cn';

  export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

  interface Props {
    trigger: Snippet;
    content: Snippet;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: PopoverSide;
    panelClass?: string;
    class?: string;
    style?: string;
    'aria-label'?: string;
  }

  let {
    trigger,
    content,
    open,
    defaultOpen = false,
    onOpenChange,
    side = 'bottom',
    panelClass,
    class: className,
    style,
    'aria-label': ariaLabel = 'Popover',
  }: Props = $props();

  let internalOpen = $state(defaultOpen);
  let rootEl = $state<HTMLElement | null>(null);
  const popoverId = `lr-popover-${Math.random().toString(36).slice(2, 9)}`;
  const isOpen = $derived(open !== undefined ? open : internalOpen);

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  }

  $effect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootEl?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  });
</script>

<span bind:this={rootEl} class={cn(styles.wrapper, className)} {style}>
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <span
    role="button"
    tabindex="0"
    onclick={() => setOpen(!isOpen)}
    onkeydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(!isOpen);
      }
    }}
    aria-expanded={isOpen}
    aria-controls={isOpen ? popoverId : undefined}
  >
    {@render trigger()}
  </span>
  {#if isOpen}
    <div
      id={popoverId}
      role="dialog"
      aria-label={ariaLabel}
      class={cn(styles.popover, panelClass)}
      data-side={side}
    >
      {@render content()}
    </div>
  {/if}
</span>
