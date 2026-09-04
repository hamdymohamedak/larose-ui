<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '@larose-ui/runtime-vue/toast';
import { CommandPalette, useCommandPaletteShortcut } from '@larose-ui/vue';

const open = ref(false);
const { toast } = useToast();
useCommandPaletteShortcut(() => {
  open.value = true;
});

const items = [
  {
    id: 'toast',
    label: 'Show toast',
    group: 'Actions',
    onSelect: () => toast({ title: 'Sandbox', message: 'Command selected.', variant: 'success' }),
  },
  {
    id: 'docs',
    label: 'Parity note',
    group: 'Actions',
    onSelect: () =>
      toast({
        title: 'Docs',
        message: 'Storybook catalogs; sandboxes + Playwright prove parity.',
        variant: 'info',
      }),
  },
];
</script>

<template>
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">Press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>, or open with the button.</p>
    <button type="button" data-sbx="open-command" @click="open = true">Open command palette</button>
    <CommandPalette
      :open="open"
      :items="items"
      aria-label="Sandbox command palette"
      ariaLabel="Sandbox command palette"
      @open-change="open = $event"
    />
  </div>
</template>
