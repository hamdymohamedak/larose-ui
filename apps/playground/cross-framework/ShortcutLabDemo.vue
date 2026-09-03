<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  detectPlatform,
  formatAccelerator,
  type Accelerator,
} from '@larose-ui/core';
import Button from '../../../packages/vue/src/components/Button/Button.vue';
import CommandPalette from '../../../packages/vue/src/components/CommandPalette/CommandPalette.vue';
import { useCommandPaletteShortcut } from '../../../packages/vue/src/components/CommandPalette/useCommandPaletteShortcut';
import Menu from '../../../packages/vue/src/components/Menu/Menu.vue';
import Typography from '../../../packages/vue/src/components/Typography/Typography.vue';
import { useAccelerator } from '../../../packages/vue/src/composables/useAccelerator';
import type { MenuEntry } from '../../../packages/vue/src/Menu/types';
import { DEMO_ACCELERATORS } from '../stories/demoAccelerators';

const events = ref<string[]>([]);
const menuOpen = ref(false);
const paletteOpen = ref(false);
const panelOpen = ref(false);

const platform = detectPlatform();
const mod = platform === 'macos' ? '⌘' : 'Ctrl';

function formatDemo(accel: Accelerator): string {
  return formatAccelerator(accel);
}

function log(message: string) {
  const stamp = new Date().toLocaleTimeString();
  events.value = [`${stamp} — ${message}`, ...events.value].slice(0, 12);
}

useCommandPaletteShortcut(() => {
  paletteOpen.value = true;
  log('Command palette opened (mod+K)');
});

useAccelerator(DEMO_ACCELERATORS.customPanel, () => {
  panelOpen.value = true;
  log(`Custom global shortcut (${formatDemo(DEMO_ACCELERATORS.customPanel)})`);
});

const fileEntries = computed<MenuEntry[]>(() => [
  {
    id: 'new',
    label: 'New Document',
    accelerator: DEMO_ACCELERATORS.newDocument,
    onSelect: () => log('Menu: New Document'),
  },
  {
    id: 'open',
    label: 'Open…',
    accelerator: DEMO_ACCELERATORS.open,
    onSelect: () => log('Menu: Open'),
  },
  { type: 'separator' },
  {
    id: 'save',
    label: 'Save',
    accelerator: DEMO_ACCELERATORS.save,
    onSelect: () => log('Menu: Save'),
  },
  {
    id: 'save-as',
    label: 'Save As…',
    accelerator: DEMO_ACCELERATORS.saveAs,
    onSelect: () => log('Menu: Save As'),
  },
  { type: 'separator' },
  {
    id: 'copy',
    label: 'Copy',
    accelerator: DEMO_ACCELERATORS.copy,
    disabled: true,
    onSelect: () => log('Menu: Copy (should not fire)'),
  },
  {
    id: 'paste',
    label: 'Paste',
    accelerator: DEMO_ACCELERATORS.paste,
    onSelect: () => log('Menu: Paste'),
  },
  {
    id: 'find',
    label: '&Find…',
    mnemonic: 'f',
    accelerator: DEMO_ACCELERATORS.find,
    onSelect: () => log('Menu: Find'),
  },
]);

const saveDisplay = formatAccelerator(DEMO_ACCELERATORS.save);

const paletteItems = [
  {
    id: 'goto-dashboard',
    label: 'Go to Dashboard',
    group: 'Navigation',
    onSelect: () => log('Palette: Go to Dashboard'),
  },
  {
    id: 'toggle-theme',
    label: 'Toggle Theme',
    group: 'Preferences',
    onSelect: () => log('Palette: Toggle Theme'),
  },
];
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      padding: 2rem;
      box-sizing: border-box;
    "
  >
    <Typography role="headline">Keyboard shortcut lab</Typography>

    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 36rem;
        color: var(--lr-color-text-muted);
        font-size: var(--lr-font-size-sm);
      "
    >
      <Typography role="caption">
        Detected platform: <strong>{{ platform }}</strong> — primary modifier:
        <strong>{{ mod }}</strong>
      </Typography>
      <ul style="margin: 0; padding-left: 1.25rem">
        <li>
          <strong>{{ formatDemo(DEMO_ACCELERATORS.save) }}</strong> — Save (global on Menu Bar story)
        </li>
        <li>
          <strong>{{ mod }}+K</strong> — Command palette
        </li>
        <li>
          <strong>{{ formatDemo(DEMO_ACCELERATORS.customPanel) }}</strong> — Custom global panel
          (Shortcut Lab only)
        </li>
        <li>
          Open File menu →
          <strong>{{ formatDemo(DEMO_ACCELERATORS.newDocument) }}</strong>, type-ahead letters, Enter
          to confirm
        </li>
        <li v-if="platform !== 'macos'">
          <strong>Alt</strong> — reveal underlined mnemonics; <strong>Alt+F</strong> opens File
        </li>
        <li v-else>
          Hold <strong>Option</strong> while a menu is open for alternate items
        </li>
      </ul>
    </div>

    <div
      style="
        width: 100%;
        max-width: 36rem;
        border: 1px solid var(--lr-color-border);
        border-radius: var(--lr-radius-md);
        background: var(--lr-color-surface-elevated);
        padding: 0.75rem 1rem;
        font-family: var(--lr-font-family-mono);
        font-size: var(--lr-font-size-xs);
        max-height: 12rem;
        overflow: auto;
      "
    >
      <span v-if="events.length === 0" style="color: var(--lr-color-text-muted)">
        No shortcuts fired yet…
      </span>
      <ul v-else style="margin: 0; padding-left: 1.25rem">
        <li v-for="(event, index) in events" :key="`${event}-${index}`">{{ event }}</li>
      </ul>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center">
      <Menu
        :entries="fileEntries"
        :open="menuOpen"
        @open-change="menuOpen = $event"
        @entry-select="(entry) => log(`Selected: ${entry.label}`)"
      >
        <Button variant="secondary">File</Button>
      </Menu>
      <Button variant="outline" @click="menuOpen = true">Open menu</Button>
      <Button variant="outline" @click="paletteOpen = true">
        Command palette ({{ mod }}+K)
      </Button>
    </div>

    <Typography role="caption" muted>
      With the menu open, type <strong>s</strong> for type-ahead, then <strong>Enter</strong>. Save
      displays as <strong>{{ saveDisplay }}</strong> on this platform.
    </Typography>

    <div
      v-if="panelOpen"
      role="dialog"
      aria-label="Custom panel"
      style="
        padding: 1rem 1.25rem;
        border: 1px solid var(--lr-color-border);
        border-radius: var(--lr-radius-lg);
        background: var(--lr-color-surface-elevated);
        box-shadow: var(--lr-shadow-md);
      "
    >
      <Typography role="body">
        Custom panel opened via {{ formatDemo(DEMO_ACCELERATORS.customPanel) }}
      </Typography>
      <Button size="sm" style="margin-top: 0.75rem" @click="panelOpen = false">Close</Button>
    </div>

    <CommandPalette
      :open="paletteOpen"
      :items="paletteItems"
      @open-change="paletteOpen = $event"
    />
  </div>
</template>
