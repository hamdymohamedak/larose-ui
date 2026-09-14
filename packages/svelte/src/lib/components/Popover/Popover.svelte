<script lang="ts">
  import type { Snippet } from 'svelte';
  import { activateOverlayFocus } from '@larose-ui/primitives';
  import {
    createPresenceController,
    presenceMotionClassKey,
    type PresencePhase,
  } from '@larose-ui/component-logic/overlay';
  import styles from '@larose-ui/styles/components/Popover/Popover.module.css';
  import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
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
  let panelEl = $state<HTMLElement | null>(null);
  const popoverId = `lr-popover-${Math.random().toString(36).slice(2, 9)}`;
  const isOpen = $derived(open !== undefined ? open : internalOpen);

  const controller = createPresenceController(false);
  let phase = $state<PresencePhase>(controller.getSnapshot().phase);
  let shouldRender = $state(controller.getSnapshot().shouldRender);

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  }

  function onAnimationEnd(event: AnimationEvent) {
    if (event.target !== event.currentTarget) return;
    controller.handleAnimationEnd();
  }

  $effect(() => {
    return controller.subscribe(() => {
      const snap = controller.getSnapshot();
      phase = snap.phase;
      shouldRender = snap.shouldRender;
    });
  });

  $effect(() => {
    controller.setPresent(isOpen);
  });

  $effect(() => {
    return () => controller.dispose();
  });

  $effect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootEl?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    let deactivate: (() => void) | undefined;
    queueMicrotask(() => {
      deactivate = activateOverlayFocus({
        container: panelEl,
        onEscape: () => setOpen(false),
        lockScroll: false,
      });
    });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      deactivate?.();
    };
  });

  const panelClassName = $derived.by(() => {
    const key = presenceMotionClassKey('popover', phase);
    return cn(
      styles.popover,
      panelClass,
      key ? motionStyles[key as keyof typeof motionStyles] : undefined,
    );
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
  {#if shouldRender}
    <div
      bind:this={panelEl}
      id={popoverId}
      role="dialog"
      aria-label={ariaLabel}
      class={panelClassName}
      data-side={side}
      data-placement={side}
      data-presence={phase}
      onanimationend={onAnimationEnd}
    >
      {@render content()}
    </div>
  {/if}
</span>
