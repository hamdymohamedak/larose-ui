<script lang="ts">
  import CollaborationButton from '../../../packages/svelte/src/lib/components/Sharing/CollaborationButton.svelte';
  import CollaborationPopover from '../../../packages/svelte/src/lib/components/Sharing/CollaborationPopover.svelte';

  const DEFAULT_COLLABORATORS = [
    { id: '1', name: 'Sara Ali', initials: 'SA' },
    { id: '2', name: 'Omar Hassan', initials: 'OH' },
    { id: '3', name: 'Lina Koch', initials: 'LK' },
  ];

  interface Props {
    defaultOpen?: boolean;
    collaborators?: { id: string; name: string; initials?: string }[];
  }

  let {
    defaultOpen = true,
    collaborators = DEFAULT_COLLABORATORS,
  }: Props = $props();
</script>

<div style="display: flex; justify-content: center; padding: 2rem 1rem 18rem">
  <CollaborationPopover
    {collaborators}
    {defaultOpen}
    actions={[
      {
        id: 'updates',
        label: 'Recent updates',
        description: 'Sara edited the introduction 5 minutes ago',
      },
      {
        id: 'activity',
        label: 'View all activity',
        description: 'See the full collaboration timeline',
      },
    ]}
  >
    {#snippet trigger()}
      <CollaborationButton {collaborators} />
    {/snippet}
  </CollaborationPopover>
</div>
