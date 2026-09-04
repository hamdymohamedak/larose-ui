<script setup lang="ts">
import { ref } from 'vue';
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import { Card } from '@larose-ui/vue';

const theme = ref<'light' | 'dark'>('light');
</script>

<template>
  <LaRoseProvider :theme="theme" locale="en" tenant-id="sandbox">
    <div class="sbx-stage-pad sbx-stack">
      <p class="sbx-muted">
        Provider root should expose <code>data-lr-theme="{{ theme }}"</code>.
      </p>
      <p data-sbx="theme-label">Current theme: {{ theme }}</p>
      <button
        type="button"
        data-sbx="toggle-theme"
        @click="theme = theme === 'light' ? 'dark' : 'light'"
      >
        Toggle theme
      </button>
      <Card title="Themed surface">
        <p class="sbx-muted" style="margin: 0">Card tokens follow the active theme.</p>
      </Card>
    </div>
  </LaRoseProvider>
</template>
