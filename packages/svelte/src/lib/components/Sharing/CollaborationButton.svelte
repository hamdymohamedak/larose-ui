<script lang="ts">
  import type { Collaborator } from '../../Sharing/types';
  import { collaboratorInitials } from '../../Sharing/utils';
  import PeopleIcon from './PeopleIcon.svelte';
  import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

  let {
    collaborators,
    label = 'Collaboration',
    maxVisible = 3,
    class: className,
    onclick,
  }: { collaborators: Collaborator[]; label?: string; maxVisible?: number; class?: string; onclick?: (event: MouseEvent) => void } = $props();

  const visible = $derived(collaborators.slice(0, maxVisible));
  const overflow = $derived(collaborators.length - visible.length);
</script>

<button type="button" class={[styles.collaborationButton, className].filter(Boolean).join(' ')} aria-label={`${label}, ${collaborators.length} collaborators`} {onclick}>
  {#if collaborators.length > 0}
    <span class={styles.avatarStack} aria-hidden="true">
      {#each visible as person (person.id)}
        <span class={styles.avatar} title={person.name}>
          {#if person.avatarUrl}<img src={person.avatarUrl} alt="" />{:else}{person.initials ?? collaboratorInitials(person.name)}{/if}
        </span>
      {/each}
      {#if overflow > 0}<span class={`${styles.avatar} ${styles.avatarOverflow}`}>+{overflow}</span>{/if}
    </span>
  {:else}
    <PeopleIcon />
  {/if}
  <span>{collaborators.length > 0 ? `${collaborators.length}` : 'Share'}</span>
</button>
