<script setup lang="ts">
import Card from '../../../packages/vue/src/components/Card/Card.vue';
import UnsavedIndicator from '../../../packages/vue/src/components/FileManagement/UnsavedIndicator.vue';
</script>

<template>
  <Card title="Autosave vs manual save" padding="md">
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <UnsavedIndicator title="Untitled" edited autosave-enabled />
      <UnsavedIndicator title="Budget Proposal" :edited="false" autosave-enabled />
      <UnsavedIndicator title="Meeting Notes" edited :autosave-enabled="false" />
    </div>
  </Card>
</template>
