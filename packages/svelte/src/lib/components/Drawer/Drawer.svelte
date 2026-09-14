<script lang="ts">
  import type { Snippet } from 'svelte';
  import { activateOverlayFocus, focusFirst } from '@larose-ui/primitives';
  import {
    createPresenceController,
    presenceMotionClassKey,
    shouldDismissOnOverlayClick,
    type PresencePhase,
  } from '@larose-ui/component-logic/overlay';
  import styles from '@larose-ui/styles/components/Drawer/Drawer.module.css';
  import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
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
      if (!focusFirst(panelEl)) {
        panelEl?.focus();
      }
      deactivate = activateOverlayFocus({
        container: panelEl,
        onEscape: close,
        autoFocus: false,
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

  const panelClassName = $derived.by(() => {
    const kind = (merged.side ?? 'right') === 'right' ? 'drawer-right' : 'drawer-left';
    const key = presenceMotionClassKey(kind, phase);
    return cn(
      styles.panel,
      merged.panelClass,
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
    style={merged.style}
    role="presentation"
    data-presence={phase}
    onclick={onOverlayClick}
    onanimationend={onAnimationEnd}
  >
    <aside
      bind:this={panelEl}
      class={panelClassName}
      data-side={merged.side ?? 'right'}
      data-presence={phase}
      role="dialog"
      aria-modal="true"
      aria-labelledby={merged.title ? 'lr-drawer-title' : undefined}
      aria-describedby={merged.description ? 'lr-drawer-desc' : undefined}
      tabindex="-1"
      onanimationend={onAnimationEnd}
    >
      {#if merged.title}
        <h2 id="lr-drawer-title" class={styles.title}>{merged.title}</h2>
      {/if}
      {#if merged.description}
        <p id="lr-drawer-desc" class={styles.description}>{merged.description}</p>
      {/if}
      <div class={styles.content}>{@render merged.children()}</div>
    </aside>
  </div>
{/if}
