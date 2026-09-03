<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    class?: string;
    style?: string;
    onExpandedChange?: (expanded: boolean) => void;
    children?: Snippet;
  }

  let {
    label,
    expanded,
    defaultExpanded = false,
    disabled = false,
    class: className,
    style,
    onExpandedChange,
    children,
  }: Props = $props();

  let internal = $state(defaultExpanded);
  const isExpanded = $derived(expanded !== undefined ? expanded : internal);
  const panelId = `disclosure-${Math.random().toString(36).slice(2)}`;

  function toggle() {
    if (disabled) return;
    const next = !isExpanded;
    if (expanded === undefined) internal = next;
    onExpandedChange?.(next);
  }
</script>

<div class={cn(styles.group, className)} {style}>
  <div class={styles.row}>
    <button
      type="button"
      class={styles.triangleButton}
      data-expanded={isExpanded ? 'true' : 'false'}
      aria-expanded={isExpanded}
      aria-controls={children ? panelId : undefined}
      aria-label={`${label}, ${isExpanded ? 'expanded' : 'collapsed'}`}
      {disabled}
      onclick={toggle}
    >
      <svg class={styles.triangleIcon} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M4.5 3.25 7.5 6 4.5 8.75"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <span class={styles.triangleLabel}>{label}</span>
  </div>
  {#if children && isExpanded}
    <div id={panelId} class={styles.panel} role="region" aria-label={label}>
      {@render children()}
    </div>
  {/if}
</div>
