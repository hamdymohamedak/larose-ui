<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ActivityItem, ActivityPresentation } from '../../Sharing/types';
  import { partitionActivities, prepareActivities } from '../../Sharing/activityUtils';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  let {
    open,
    onClose,
    activities,
    excludedActivityIds = [],
    presentation = 'sheet',
    title,
    onActivitySelect,
    footer,
    anchorEl,
    class: className,
    style,
  }: {
    open: boolean;
    onClose: () => void;
    activities: ActivityItem[];
    excludedActivityIds?: string[];
    presentation?: ActivityPresentation;
    title?: string;
    onActivitySelect?: (activity: ActivityItem) => void;
    footer?: Snippet;
    anchorEl?: HTMLElement | null;
    class?: string;
    style?: string;
  } = $props();

  const titleId = $props.id();
  const prepared = $derived(prepareActivities(activities, excludedActivityIds));
  const parts = $derived(partitionActivities(prepared));

  $effect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    if (presentation === 'sheet') document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (presentation === 'sheet') document.body.style.overflow = '';
    };
  });

  function handleSelect(activity: ActivityItem) {
    activity.onSelect?.();
    onActivitySelect?.(activity);
    onClose();
  }

  const anchorStyle = $derived.by(() => {
    const anchor = anchorEl?.getBoundingClientRect();
    if (!anchor) return undefined;
    return `position:fixed;top:${anchor.bottom + 8}px;right:${Math.max(16, window.innerWidth - anchor.right)}px;z-index:100;${style ?? ''}`;
  });
</script>

{#snippet panel()}
  {#if title}<div class={styles.activityHeader}><h2 id={titleId} class={styles.sheetTitle}>{title}</h2></div>{/if}
  {#if parts.share.length > 0}
    <div class={styles.activityShareRow} role="group" aria-label="Share destinations">
      {#each parts.share as activity (activity.id)}
        <button type="button" class={styles.activityShareTile} onclick={() => handleSelect(activity)}>
          {#if activity.icon}<span class={styles.activityShareIcon}></span>{/if}
          <span class={styles.activityShareLabel}>{activity.title}</span>
          {#if activity.subtitle}<span class={styles.activityShareSubtitle}>{activity.subtitle}</span>{/if}
        </button>
      {/each}
    </div>
  {/if}
  {#if parts.app.length > 0 || parts.actions.length > 0}
    <div class={styles.activityActionSection}>
      {#if parts.app.length > 0}
        <ul class={styles.activityActionList} role="menu" aria-label="App actions">
          {#each parts.app as activity (activity.id)}
            <li><button type="button" class={styles.activityActionRow} role="menuitem" onclick={() => handleSelect(activity)}>{#if activity.icon}<span class={styles.activityActionIcon}></span>{/if}<span class={styles.activityActionTitle}>{activity.title}</span></button></li>
          {/each}
        </ul>
      {/if}
      {#if parts.app.length > 0 && parts.actions.length > 0}<div class={styles.activitySectionDivider} role="separator"></div>{/if}
      {#if parts.actions.length > 0}
        <ul class={styles.activityActionList} role="menu" aria-label="Actions">
          {#each parts.actions as activity (activity.id)}
            <li><button type="button" class={styles.activityActionRow} role="menuitem" onclick={() => handleSelect(activity)}>{#if activity.icon}<span class={styles.activityActionIcon}></span>{/if}<span class={styles.activityActionTitle}>{activity.title}</span></button></li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
  {#if footer}<div class={styles.section}>{@render footer()}</div>{/if}
{/snippet}

{#if open}
  {#if presentation === 'popover'}
    <div class={styles.activityPopoverBackdrop} role="presentation" onclick={onClose}>
      <div class={[styles.activityPopover, className].filter(Boolean).join(' ')} style={anchorStyle} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} onclick={(event) => event.stopPropagation()}>
        {@render panel()}
      </div>
    </div>
  {:else}
    <div class={styles.sheetOverlay} role="presentation" onclick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div class={[styles.activitySheet, className].filter(Boolean).join(' ')} {style} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined}>
        {@render panel()}
      </div>
    </div>
  {/if}
{/if}
