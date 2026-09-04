<script setup lang="ts">
import { ref } from 'vue';
import DocumentToolbar from '../../../packages/vue/src/components/FileManagement/DocumentToolbar.vue';
import UnsavedIndicator from '../../../packages/vue/src/components/FileManagement/UnsavedIndicator.vue';
import Header from '../../../packages/vue/src/components/Header/Header.vue';
import HeaderActions from '../../../packages/vue/src/components/Header/HeaderActions.vue';
import HeaderTitle from '../../../packages/vue/src/components/Header/HeaderTitle.vue';
import Typography from '../../../packages/vue/src/components/Typography/Typography.vue';

withDefaults(
  defineProps<{
    title?: string;
  }>(),
  { title: 'Product Roadmap' },
);

const edited = ref(true);
const autosave = ref(true);
</script>

<template>
  <Header>
    <HeaderTitle>
      <UnsavedIndicator :title="title" :edited="edited" :autosave-enabled="autosave" />
    </HeaderTitle>
    <HeaderActions>
      <DocumentToolbar
        :show-add-button="false"
        save-label="Save"
        :can-save="edited"
        @save="edited = false"
      />
    </HeaderActions>
  </Header>
  <div style="margin-top: 1rem; display: grid; gap: 1rem">
    <Typography role="footnote" muted>
      Toggle autosave to see the unsaved-changes dot when manual save is required.
    </Typography>
    <label style="display: inline-flex; gap: 0.5rem; align-items: center">
      <input v-model="autosave" type="checkbox" />
      Autosave enabled
    </label>
    <button type="button" @click="edited = true">Mark as edited</button>
  </div>
</template>
