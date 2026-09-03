<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CollaborationAction, Collaborator } from '../../Sharing/types';
  import { collaboratorInitials } from '../../Sharing/utils';
  import MessageIcon from './MessageIcon.svelte';
  import VideoIcon from './VideoIcon.svelte';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  let {
    trigger,
    collaborators,
    actions = [],
    manageLabel = 'Manage Shared File',
    onManage,
    onMessage,
    onVideo,
    open,
    defaultOpen = false,
    onOpenChange,
    class: className,
    style,
  }: {
    trigger: Snippet;
    collaborators: Collaborator[];
    actions?: CollaborationAction[];
    manageLabel?: string;
    onManage?: () => void;
    onMessage?: () => void;
    onVideo?: () => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    style?: string;
  } = $props();

  let internalOpen = $state(defaultOpen);
  const isOpen = $derived(open ?? internalOpen);
  const popoverId = $props.id();
  let rootEl = $state<HTMLSpanElement | null>(null);
  let align = $state<'start' | 'end'>('end');

  function setOpen(next: boolean) {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  }

  $effect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => { if (!rootEl?.contains(event.target as Node)) setOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('mousedown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  });
</script>

<span bind:this={rootEl} class={[styles.wrapper, className].filter(Boolean).join(' ')} {style}>
  <span onclick={() => setOpen(!isOpen)} aria-expanded={isOpen} aria-controls={isOpen ? popoverId : undefined}>{@render trigger()}</span>
  {#if isOpen}
    <div id={popoverId} role="dialog" aria-label="Collaboration" class={styles.popover} data-side="bottom" data-align={align}>
      <div class={styles.section}>
        {#each collaborators as person (person.id)}
          <div class={styles.collaboratorRow}>
            <span class={styles.avatar} aria-hidden="true">{#if person.avatarUrl}<img src={person.avatarUrl} alt="" />{:else}{person.initials ?? collaboratorInitials(person.name)}{/if}</span>
            <span class={styles.collaboratorName}>{person.name}</span>
          </div>
        {/each}
        {#if onMessage || onVideo}
          <div class={styles.communicationRow}>
            {#if onMessage}<button type="button" class={styles.commButton} onclick={onMessage}><MessageIcon />Messages</button>{/if}
            {#if onVideo}<button type="button" class={styles.commButton} onclick={onVideo}><VideoIcon />FaceTime</button>{/if}
          </div>
        {/if}
      </div>
      {#if actions.length > 0}
        <div class={styles.section}>
          {#each actions as action (action.id)}
            <button type="button" class={styles.actionButton} onclick={() => { action.onSelect?.(); setOpen(false); }}>
              <span class={styles.optionLabel}>{action.label}</span>
              {#if action.description}<span class={styles.optionDescription}>{action.description}</span>{/if}
            </button>
          {/each}
        </div>
      {/if}
      {#if onManage}
        <div class={styles.section}>
          <button type="button" class={styles.manageButton} onclick={() => { onManage(); setOpen(false); }}>{manageLabel}</button>
        </div>
      {/if}
    </div>
  {/if}
</span>
