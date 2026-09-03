<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CollaborationAction, Collaborator, ShareDestination, SharePermissionOption, ShareSettings } from '../../Sharing/types';
  import ShareButton from './ShareButton.svelte';
  import ShareSheet from './ShareSheet.svelte';
  import CollaborationButton from './CollaborationButton.svelte';
  import CollaborationPopover from './CollaborationPopover.svelte';
  import LinkIcon from './LinkIcon.svelte';
  import CopyIcon from './CopyIcon.svelte';
  import MessageIcon from './MessageIcon.svelte';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  const defaultShareSettings: ShareSettings = { audience: 'invited', permission: 'edit' };
  const defaultDestinations: ShareDestination[] = [
    { id: 'copy-link', label: 'Copy Link', icon: LinkIcon },
    { id: 'copy', label: 'Send Copy', icon: CopyIcon },
    { id: 'messages', label: 'Messages', icon: MessageIcon },
  ];

  let {
    shareTitle = 'Share Document',
    collaborating = false,
    collaborators = [],
    shareSettings = defaultShareSettings,
    onShareSettingsChange,
    destinations = defaultDestinations,
    permissionOptions,
    collaborationActions,
    onManageSharedFile,
    manageLabel,
    onMessage,
    onVideo,
    trailing,
    class: className,
    style,
  }: {
    shareTitle?: string;
    collaborating?: boolean;
    collaborators?: Collaborator[];
    shareSettings?: ShareSettings;
    onShareSettingsChange?: (settings: ShareSettings) => void;
    destinations?: ShareDestination[];
    permissionOptions?: SharePermissionOption[];
    collaborationActions?: CollaborationAction[];
    onManageSharedFile?: () => void;
    manageLabel?: string;
    onMessage?: () => void;
    onVideo?: () => void;
    trailing?: Snippet;
    class?: string;
    style?: string;
  } = $props();

  let shareOpen = $state(false);
  let settings = $state(shareSettings);
</script>

<div class={[styles.toolbar, className].filter(Boolean).join(' ')} {style}>
  <ShareButton onclick={() => (shareOpen = true)} />
  {#if collaborating}
    <CollaborationPopover
      {collaborators}
      actions={collaborationActions}
      {manageLabel}
      onManage={onManageSharedFile}
      {onMessage}
      {onVideo}
    >
      {#snippet trigger()}
        <CollaborationButton {collaborators} />
      {/snippet}
    </CollaborationPopover>
  {/if}
  {@render trailing?.()}
  <ShareSheet open={shareOpen} onClose={() => (shareOpen = false)} title={shareTitle} {settings} onSettingsChange={(next) => { settings = next; onShareSettingsChange?.(next); }} {destinations} {permissionOptions} />
</div>
