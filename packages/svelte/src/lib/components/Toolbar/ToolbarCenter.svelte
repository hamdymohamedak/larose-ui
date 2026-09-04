<script lang="ts">
  import type { Snippet } from 'svelte';
  import ToolbarSection from './ToolbarSection.svelte';

  let { class: className, style, children }: { class?: string; style?: string; children?: Snippet } = $props();
</script>

<ToolbarSection placement="center" collapsible class={className} {style}>{@render children?.()}</ToolbarSection>
