/** Browser-safe scenario catalog — same ids/titles across React, Vue, Svelte sandboxes. */
export const SCENARIOS = [
  {
    id: 'home',
    title: 'Home',
    description: 'Kitchen-sink overview. Sandboxes are real consumer apps for multi-framework QA.',
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Sidebar + header shell — layout and theme tokens in a product frame.',
  },
  {
    id: 'command',
    title: 'Command',
    description: 'Command palette portal, search, keyboard open (⌘K / Ctrl+K).',
  },
  {
    id: 'overlays',
    title: 'Overlays',
    description: 'Modal + focus trap + escape — stacking outside Storybook.',
  },
  {
    id: 'toast',
    title: 'Toast',
    description: 'Runtime toast viewport and status announcements.',
  },
  {
    id: 'theme',
    title: 'Theme',
    description: 'Light/dark theme on the provider root (data-lr-theme).',
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Basic field + submit — adapter wiring for inputs and buttons.',
  },
  {
    id: 'accelerators',
    title: 'Accelerators',
    description: 'Global keyboard accelerators via AcceleratorProvider.',
  },
];

/** Ports used by Playwright and docs — keep in sync with each sandbox vite.config. */
export const SANDBOX_PORTS = {
  react: 5173,
  vue: 5174,
  svelte: 5175,
};
