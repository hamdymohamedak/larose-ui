<script setup lang="ts">
import type { Collaborator } from '../../Sharing/types';
import { collaboratorInitials } from '../../Sharing/utils';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';
import { PeopleIcon } from './icons';
const props = withDefaults(defineProps<{ collaborators: Collaborator[]; label?: string; maxVisible?: number; class?: string }>(), { label: 'Collaboration', maxVisible: 3 });
</script>
<template>
  <button type="button" :class="cn(styles.collaborationButton, props.class)" :aria-label="`${label}, ${collaborators.length} collaborators`">
    <span v-if="collaborators.length" :class="styles.avatarStack" aria-hidden="true">
      <span v-for="person in collaborators.slice(0, maxVisible)" :key="person.id" :class="styles.avatar" :title="person.name">
        <img v-if="person.avatarUrl" :src="person.avatarUrl" alt="" />
        <template v-else>{{ person.initials ?? collaboratorInitials(person.name) }}</template>
      </span>
      <span v-if="collaborators.length > maxVisible" :class="[styles.avatar, styles.avatarOverflow].join(' ')">+{{ collaborators.length - maxVisible }}</span>
    </span>
    <PeopleIcon v-else />
    <span>{{ collaborators.length > 0 ? `${collaborators.length}` : 'Share' }}</span>
  </button>
</template>
