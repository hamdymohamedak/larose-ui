<script lang="ts">
  import styles from '@larose-ui/styles/components/PathControl/PathControl.module.css';
  import { cn } from '../../utils/cn';
  import {
    collapsePathSegments,
    isEllipsisSegment,
    resolveSelectedSegment,
  } from '../../PathControl/utils';
  import type { PathControlVariant, PathSegment } from '../../PathControl/types';

  interface Props {
    segments: PathSegment[];
    selectedId?: string;
    variant?: PathControlVariant;
    class?: string;
    style?: string;
    onSelect?: (segment: PathSegment) => void;
    onSelectedIdChange?: (id: string) => void;
  }

  let {
    segments,
    selectedId = $bindable<string | undefined>(undefined),
    variant = 'standard',
    class: className,
    style,
    onSelect,
    onSelectedIdChange,
  }: Props = $props();

  const visible = $derived(collapsePathSegments(segments));
  const selected = $derived(resolveSelectedSegment(segments, selectedId));

  function select(segment: PathSegment) {
    selectedId = segment.id;
    onSelectedIdChange?.(segment.id);
    onSelect?.(segment);
  }
</script>

<nav
  class={cn(styles.pathControl, variant === 'standard' ? styles.standard : undefined, className)}
  {style}
  data-variant={variant}
  aria-label="Path"
>
  {#each visible as segment, index (segment.id)}
    {#if isEllipsisSegment(segment)}
      <span class={styles.ellipsis}>…</span>
    {:else}
      <button
        type="button"
        class={styles.segment}
        data-selected={selected?.id === segment.id ? 'true' : undefined}
        onclick={() => select(segment)}
      >
        {segment.label}
      </button>
    {/if}
    {#if index < visible.length - 1}
      <span class={styles.separator} aria-hidden="true">/</span>
    {/if}
  {/each}
</nav>
