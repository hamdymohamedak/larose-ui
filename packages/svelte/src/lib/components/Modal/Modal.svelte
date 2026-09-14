<script lang="ts">
  import type { Snippet } from 'svelte';
  import { activateOverlayFocus } from '@larose-ui/primitives';
  import {
    createPresenceController,
    MODAL_ARIA_IDS,
    presenceMotionClassKey,
    shouldDismissOnOverlayClick,
    type PresencePhase,
  } from '@larose-ui/component-logic/overlay';
  import styles from '@larose-ui/styles/components/Modal/Modal.module.css';
  import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
  import { cn } from '../../utils/cn';
  import { portal } from '../../utils/portal';
  import { getComponentDefaults } from '../../theme/context';

  interface Props {
    open: boolean;
    title?: string;
    description?: string;
    closeOnOverlay?: boolean;
    class?: string;
    style?: string;
    overlayClass?: string;
    contentClass?: string;
    onclose?: () => void;
    children: Snippet;
  }

  let props: Props = $props();
  const merged = $derived(getComponentDefaults('Modal', props));

  let dialogEl = $state<HTMLDivElement | null>(null);
  const controller = createPresenceController(false);
  let phase = $state<PresencePhase>(controller.getSnapshot().phase);
  let shouldRender = $state(controller.getSnapshot().shouldRender);

  $effect(() => {
    return controller.subscribe(() => {
      const snap = controller.getSnapshot();
      phase = snap.phase;
      shouldRender = snap.shouldRender;
    });
  });

  $effect(() => {
    controller.setPresent(merged.open);
  });

  $effect(() => {
    if (!merged.open) return;
    let deactivate: (() => void) | undefined;
    queueMicrotask(() => {
      deactivate = activateOverlayFocus({
        container: dialogEl,
        onEscape: close,
      });
    });
    return () => deactivate?.();
  });

  $effect(() => {
    return () => controller.dispose();
  });

  function close() {
    merged.onclose?.();
  }

  function onOverlayClick(event: MouseEvent) {
    if (
      shouldDismissOnOverlayClick({
        closeOnOverlay: merged.closeOnOverlay,
        eventTarget: event.target,
        currentTarget: event.currentTarget,
      })
    ) {
      close();
    }
  }

  function onAnimationEnd(event: AnimationEvent) {
    if (event.target !== event.currentTarget) return;
    controller.handleAnimationEnd();
  }

  const backdropClass = $derived.by(() => {
    const key = presenceMotionClassKey('backdrop', phase);
    return cn(
      styles.overlay,
      merged.overlayClass,
      key ? motionStyles[key as keyof typeof motionStyles] : undefined,
    );
  });

  const modalClass = $derived.by(() => {
    const key = presenceMotionClassKey('modal', phase);
    return cn(
      styles.modal,
      merged.contentClass,
      merged.class,
      key ? motionStyles[key as keyof typeof motionStyles] : undefined,
    );
  });
</script>

{#if shouldRender}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    use:portal
    class={backdropClass}
    role="presentation"
    data-presence={phase}
    onclick={onOverlayClick}
    onanimationend={onAnimationEnd}
  >
    <div
      bind:this={dialogEl}
      class={modalClass}
      style={merged.style}
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby={merged.title ? MODAL_ARIA_IDS.titleId : undefined}
      aria-describedby={merged.description ? MODAL_ARIA_IDS.descriptionId : undefined}
      data-presence={phase}
      onanimationend={onAnimationEnd}
      onclick={(e) => e.stopPropagation()}
    >
      {#if merged.title}
        <h2 id={MODAL_ARIA_IDS.titleId} class={styles.title}>{merged.title}</h2>
      {/if}
      {#if merged.description}
        <p id={MODAL_ARIA_IDS.descriptionId} class={styles.description}>{merged.description}</p>
      {/if}
      <div class={styles.content}>{@render merged.children()}</div>
    </div>
  </div>
{/if}
