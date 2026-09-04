<script setup lang="ts">
import CollaborationButton from '../../../packages/vue/src/components/Sharing/CollaborationButton.vue';
import CollaborationPopover from '../../../packages/vue/src/components/Sharing/CollaborationPopover.vue';

withDefaults(
  defineProps<{
    defaultOpen?: boolean;
    collaborators?: { id: string; name: string; initials?: string }[];
  }>(),
  {
    defaultOpen: true,
    collaborators: () => [
      { id: '1', name: 'Sara Ali', initials: 'SA' },
      { id: '2', name: 'Omar Hassan', initials: 'OH' },
      { id: '3', name: 'Lina Koch', initials: 'LK' },
    ],
  },
);
</script>

<template>
  <div style="display: flex; justify-content: center; padding: 2rem 1rem 18rem">
    <CollaborationPopover
      :collaborators="collaborators"
      :default-open="defaultOpen"
      :actions="[
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
      ]"
    >
      <template #trigger>
        <CollaborationButton :collaborators="collaborators" />
      </template>
    </CollaborationPopover>
  </div>
</template>
