<script lang="ts">
  import { createRawSnippet } from 'svelte';
  import Popover from '../../../packages/svelte/src/lib/components/Popover/Popover.svelte';
  import type { PopoverSide } from '../../../packages/svelte/src/lib/components/Popover/Popover.svelte';

  let {
    side = 'bottom' as PopoverSide,
    open = true,
    triggerLabel = 'Show info',
    contentText = 'Popovers present supplementary content anchored to a trigger.',
  }: {
    side?: PopoverSide;
    open?: boolean;
    triggerLabel?: string;
    contentText?: string;
  } = $props();

  const trigger = $derived(
    createRawSnippet(() => ({
      render: () => `<button type="button">${triggerLabel}</button>`,
    })),
  );

  const content = $derived(
    createRawSnippet(() => ({
      render: () => `<p style="margin:0;max-width:220px">${contentText}</p>`,
    })),
  );
</script>

<Popover {side} {open} {trigger} {content} aria-label="Popover demo" />
