<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    label,
    defaultExpanded = true,
    class: className,
    style,
    children,
  }: {
    label: string;
    defaultExpanded?: boolean;
    class?: string;
    style?: string;
    children?: Snippet;
  } = $props();

  const panelId = $props.id();
  let expanded = $state(defaultExpanded);
</script>

<div class={[styles.disclosureSection, className].filter(Boolean).join(' ')} {style}>
  <button
    type="button"
    class={styles.disclosureTrigger}
    aria-expanded={expanded}
    aria-controls={panelId}
    onclick={() => (expanded = !expanded)}
  >
    <svg
      class={styles.disclosureChevron}
      data-expanded={expanded ? 'true' : 'false'}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 3.25 7.5 6 4.5 8.75"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class={styles.disclosureLabel}>{label}</span>
  </button>
  {#if expanded}
    <div id={panelId} class={styles.disclosureContent} role="group" aria-label={label}>
      {@render children?.()}
    </div>
  {/if}
</div>
