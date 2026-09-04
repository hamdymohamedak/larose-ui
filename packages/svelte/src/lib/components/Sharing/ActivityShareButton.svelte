<script lang="ts">
  import type { ActivityItem } from '../../Sharing/types';
  import ActivityView from './ActivityView.svelte';
  import ShareButton from './ShareButton.svelte';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  let {
    activities,
    excludedActivityIds,
    label = 'Share',
    title,
    onActivitySelect,
    presentation = 'auto',
    class: className,
    style,
  }: {
    activities: ActivityItem[];
    excludedActivityIds?: string[];
    label?: string;
    title?: string;
    onActivitySelect?: (activity: ActivityItem) => void;
    presentation?: 'sheet' | 'popover' | 'auto';
    class?: string;
    style?: string;
  } = $props();

  let open = $state(false);
  let wrapEl = $state<HTMLSpanElement | null>(null);
  const resolvedPresentation = $derived(
    presentation === 'auto'
      ? typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
        ? 'popover'
        : 'sheet'
      : presentation,
  );
</script>

<span bind:this={wrapEl} class={[styles.wrapper, className].filter(Boolean).join(' ')} {style}>
  <ShareButton {label} aria-expanded={open} onclick={() => (open = true)} />
  <ActivityView {open} onClose={() => (open = false)} {activities} {excludedActivityIds} presentation={resolvedPresentation} {title} {onActivitySelect} anchorEl={wrapEl} />
</span>
