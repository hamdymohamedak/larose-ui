<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label?: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    class?: string;
    style?: string;
    ariaLabel?: string;
    onExpandedChange?: (expanded: boolean) => void;
    children: Snippet;
    detail?: Snippet;
  }

  let {
    label,
    expanded,
    defaultExpanded = false,
    disabled = false,
    class: className,
    style,
    ariaLabel = 'Show more options',
    onExpandedChange,
    children,
    detail,
  }: Props = $props();

  let internal = $state(defaultExpanded);
  const isExpanded = $derived(expanded !== undefined ? expanded : internal);
  const panelId = `disclosure-btn-${Math.random().toString(36).slice(2)}`;

  function toggle() {
    if (disabled) return;
    const next = !isExpanded;
    if (expanded === undefined) internal = next;
    onExpandedChange?.(next);
  }
</script>

<div class={cn(styles.group, className)} {style}>
  <div class={styles.buttonRow}>
    <div class={styles.buttonContent}>
      {#if label}<div class={styles.triangleLabel}>{label}</div>{/if}
      {@render children()}
    </div>
    {#if detail}
      <button
        type="button"
        class={styles.disclosureButton}
        data-expanded={isExpanded ? 'true' : 'false'}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-label={ariaLabel}
        {disabled}
        onclick={toggle}
      >
        <svg class={styles.disclosureButtonIcon} viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    {/if}
  </div>
  {#if detail && isExpanded}
    <div id={panelId} class={styles.buttonPanel} role="region" aria-label={ariaLabel}>
      {@render detail()}
    </div>
  {/if}
</div>
