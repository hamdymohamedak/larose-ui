<script lang="ts">
  import SplitView from '../../../packages/svelte/src/lib/components/SplitView/SplitView.svelte';
  import SplitViewPane from '../../../packages/svelte/src/lib/components/SplitView/SplitViewPane.svelte';
  import type { SplitOrientation } from '../../../packages/svelte/src/lib/SplitView/types';

  let {
    orientation = 'horizontal' as SplitOrientation,
    leftLabel = 'Sidebar',
    rightLabel = 'Detail content',
  }: {
    orientation?: SplitOrientation;
    leftLabel?: string;
    rightLabel?: string;
  } = $props();
</script>

<SplitView
  {orientation}
  storageKey="storybook-split-demo"
  aria-label="Split view demo"
  style="min-height: 16rem; border: 1px solid var(--lr-color-border, #e4e4e7); border-radius: 0.75rem; overflow: hidden"
>
  <SplitViewPane id="sidebar" label="Sidebar" defaultSize={32} minSize={140}>
    <div style="padding: 0.75rem; font-size: 0.875rem">
      <strong style="display: block; margin-bottom: 0.5rem">{leftLabel}</strong>
      <p style="margin: 0; opacity: 0.75">Drag the divider to resize panes.</p>
    </div>
  </SplitViewPane>
  <SplitViewPane id="content" label="Content" defaultSize={68} minSize={180}>
    <div style="padding: 0.75rem; font-size: 0.875rem">
      <strong style="display: block; margin-bottom: 0.5rem">{rightLabel}</strong>
      <p style="margin: 0; opacity: 0.75">Secondary pane updates with Storybook controls.</p>
    </div>
  </SplitViewPane>
</SplitView>
