<script lang="ts">
  import { CommandPalette, useCommandPaletteShortcut } from '@larose-ui/svelte';
  import { getToast } from '@larose-ui/runtime-svelte/toast';

  let open = $state(false);
  const { toast } = getToast();

  const unregister = useCommandPaletteShortcut(() => {
    open = true;
  });

  $effect(() => () => unregister());

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

<div class="sbx-stage-pad sbx-stack">
  <p class="sbx-muted">Press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>, or open with the button.</p>
  <button type="button" data-sbx="open-command" onclick={() => (open = true)}>
    Open command palette
  </button>
  <CommandPalette
    {open}
    {items}
    ariaLabel="Sandbox command palette"
    onOpenChange={(next: boolean) => (open = next)}
  />
</div>
