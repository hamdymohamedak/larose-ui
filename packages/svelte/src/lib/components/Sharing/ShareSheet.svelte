<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ShareAudience, ShareDestination, SharePermission, SharePermissionOption, ShareSettings } from '../../Sharing/types';
  import { formatSharePermissionSummary } from '../../Sharing/utils';
  import ChevronRightIcon from './ChevronRightIcon.svelte';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  const defaultPermissionOptions: SharePermissionOption[] = [
    { id: 'invited-edit', audience: 'invited', permission: 'edit', label: 'Only invited people', description: 'Can make changes' },
    { id: 'invited-view', audience: 'invited', permission: 'view', label: 'Only invited people', description: 'Can view only' },
    { id: 'everyone-edit', audience: 'everyone', permission: 'edit', label: 'Everyone', description: 'Can make changes' },
    { id: 'everyone-view', audience: 'everyone', permission: 'view', label: 'Everyone', description: 'Can view only' },
  ];

  let {
    open,
    onClose,
    title = 'Share',
    settings,
    onSettingsChange,
    destinations = [],
    permissionOptions = defaultPermissionOptions,
    footer,
    class: className,
    style,
  }: {
    open: boolean;
    onClose: () => void;
    title?: string;
    settings: ShareSettings;
    onSettingsChange?: (settings: ShareSettings) => void;
    destinations?: ShareDestination[];
    permissionOptions?: SharePermissionOption[];
    footer?: Snippet;
    class?: string;
    style?: string;
  } = $props();

  const titleId = $props.id();
  let showPermissions = $state(false);
  const summary = $derived(formatSharePermissionSummary(settings.audience, settings.permission));

  $effect(() => {
    if (!open) return;
    showPermissions = false;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  });
</script>

{#if open}
  <div class={styles.sheetOverlay} role="presentation" onclick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div class={[styles.sheet, className].filter(Boolean).join(' ')} {style} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div class={styles.sheetHeader}>
        <h2 id={titleId} class={styles.sheetTitle}>{title}</h2>
        {#if onSettingsChange}
          <button type="button" class={styles.permissionSummary} onclick={() => (showPermissions = !showPermissions)} aria-expanded={showPermissions}>
            <span>{summary}</span><ChevronRightIcon />
          </button>
        {/if}
      </div>
      {#if showPermissions && onSettingsChange}
        <div class={styles.permissionPanel} role="group" aria-label="Sharing permissions">
          {#each permissionOptions as option (option.id)}
            {@const selected = option.audience === settings.audience && option.permission === settings.permission}
            <button type="button" class={styles.option} data-selected={selected ? 'true' : undefined} onclick={() => { onSettingsChange({ ...settings, audience: option.audience, permission: option.permission }); showPermissions = false; }}>
              <span class={styles.optionLabel}>{option.label}</span>
              {#if option.description}<span class={styles.optionDescription}>{option.description}</span>{/if}
            </button>
          {/each}
        </div>
      {/if}
      <div class={styles.destinations} role="menu" aria-label="Share destinations">
        {#each destinations as destination (destination.id)}
          <button type="button" class={styles.destination} role="menuitem" onclick={() => { destination.onSelect?.(); onClose(); }}>
            {#if destination.icon}<span class={styles.destinationIcon}></span>{/if}
            <span>{destination.label}</span>
          </button>
        {/each}
      </div>
      {#if footer}<div class={styles.section}>{@render footer()}</div>{/if}
    </div>
  </div>
{/if}
